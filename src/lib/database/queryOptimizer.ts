import { createClientSupabaseClient } from '@/lib/supabase/browserClient';
import { createServerSupabaseClient } from '@/lib/supabase/serverClient';

interface QueryCache {
  [key: string]: {
    data: any;
    timestamp: number;
    ttl: number;
  };
}

interface QueryOptions {
  cache?: boolean;
  ttl?: number; // Time to live in milliseconds
  retry?: number;
  timeout?: number;
}

class QueryOptimizer {
  private cache: QueryCache = {};
  private connectionPool: Map<string, any> = new Map();
  private queryStats: Map<string, { count: number; avgTime: number }> = new Map();

  constructor() {
    // Clear expired cache entries every 5 minutes
    setInterval(() => this.clearExpiredCache(), 5 * 60 * 1000);
  }

  // Optimized query with caching and connection pooling
  async query<T = any>(
    queryKey: string,
    queryFn: () => Promise<T>,
    options: QueryOptions = {}
  ): Promise<T> {
    const {
      cache = true,
      ttl = 5 * 60 * 1000, // 5 minutes default
      retry = 3,
      timeout = 10000, // 10 seconds
    } = options;

    // Check cache first
    if (cache && this.cache[queryKey]) {
      const cached = this.cache[queryKey];
      if (Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
    }

    // Execute query with retry logic
    let lastError: Error;
    for (let attempt = 1; attempt <= retry; attempt++) {
      try {
        const startTime = Date.now();
        const result = await Promise.race([
          queryFn(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Query timeout')), timeout)
          ),
        ]);

        const queryTime = Date.now() - startTime;
        this.updateQueryStats(queryKey, queryTime);

        // Cache the result
        if (cache) {
          this.cache[queryKey] = {
            data: result,
            timestamp: Date.now(),
            ttl,
          };
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        if (attempt < retry) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError!;
  }

  // Optimized Supabase query with automatic caching
  async supabaseQuery<T = any>(
    table: string,
    query: any,
    options: QueryOptions = {}
  ): Promise<T> {
    const queryKey = `${table}:${JSON.stringify(query)}`;
    
    return this.query(queryKey, async (): Promise<T> => {
      const supabase = createClientSupabaseClient();
      const { data, error } = await supabase
        .from(table)
        .select(query.select || '*')
        .match(query.match || {})
        .order(query.order || 'created_at', { ascending: false })
        .limit(query.limit || 100);

      if (error) throw error;
      return data as T;
    }, options);
  }

  // Batch multiple queries for better performance
  async batchQueries(
    queries: Array<{ key: string; queryFn: () => Promise<any>; options?: QueryOptions }>
  ): Promise<any[]> {
    const results = await Promise.allSettled(
      queries.map(async ({ key, queryFn, options }) => {
        try {
          return await this.query(key, queryFn, options);
        } catch (error) {
          console.error(`Query failed for key: ${key}`, error);
          return null;
        }
      })
    );

    return results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return null;
      }
    });
  }

  // Optimized pagination query
  async paginatedQuery<T = any>(
    table: string,
    page: number = 1,
    pageSize: number = 20,
    filters: any = {},
    options: QueryOptions = {}
  ): Promise<{ data: T[]; total: number; page: number; pageSize: number }> {
    const offset = (page - 1) * pageSize;
    const queryKey = `${table}:paginated:${page}:${pageSize}:${JSON.stringify(filters)}`;

    return this.query(queryKey, async () => {
      const supabase = createClientSupabaseClient();
      
      // Get total count
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .match(filters);

      // Get paginated data
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .match(filters)
        .range(offset, offset + pageSize - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
      };
    }, options);
  }

  // Optimized search query with full-text search
  async searchQuery<T = any>(
    table: string,
    searchTerm: string,
    searchColumns: string[],
    options: QueryOptions = {}
  ): Promise<T[]> {
    const queryKey = `${table}:search:${searchTerm}:${searchColumns.join(',')}`;

    return this.query(queryKey, async () => {
      const supabase = createClientSupabaseClient();
      
      // Build search query
      let query = supabase.from(table).select('*');
      
      if (searchColumns.length === 1) {
        query = query.ilike(searchColumns[0], `%${searchTerm}%`);
      } else {
        const searchConditions = searchColumns.map(column => 
          `${column}.ilike.%${searchTerm}%`
        );
        query = query.or(searchConditions.join(','));
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data || [];
    }, options);
  }

  // Clear cache for specific key or all cache
  clearCache(key?: string): void {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }

  // Clear expired cache entries
  private clearExpiredCache(): void {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      const entry = this.cache[key];
      if (now - entry.timestamp > entry.ttl) {
        delete this.cache[key];
      }
    });
  }

  // Update query statistics
  private updateQueryStats(queryKey: string, queryTime: number): void {
    const stats = this.queryStats.get(queryKey) || { count: 0, avgTime: 0 };
    stats.count++;
    stats.avgTime = (stats.avgTime * (stats.count - 1) + queryTime) / stats.count;
    this.queryStats.set(queryKey, stats);
  }

  // Get query performance statistics
  getQueryStats(): Map<string, { count: number; avgTime: number }> {
    return new Map(this.queryStats);
  }

  // Preload frequently accessed data
  async preloadData(queries: Array<{ key: string; queryFn: () => Promise<any> }>): Promise<void> {
    await Promise.all(
      queries.map(({ key, queryFn }) =>
        this.query(key, queryFn, { cache: true, ttl: 10 * 60 * 1000 }) // 10 minutes TTL
      )
    );
  }
}

// Singleton instance
export const queryOptimizer = new QueryOptimizer();

// Utility functions for common queries
export const optimizedQueries = {
  // Get user profile with caching
  getUserProfile: (userId: string) =>
    queryOptimizer.query(
      `user_profile:${userId}`,
      async () => {
        const supabase = createClientSupabaseClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) throw error;
        return data;
      },
      { cache: true, ttl: 30 * 60 * 1000 } // 30 minutes
    ),

  // Get user subscriptions with caching
  getUserSubscriptions: (userId: string) =>
    queryOptimizer.query(
      `user_subscriptions:${userId}`,
      async () => {
        const supabase = createClientSupabaseClient();
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      },
      { cache: true, ttl: 5 * 60 * 1000 } // 5 minutes
    ),

  // Get waitlist statistics
  getWaitlistStats: () =>
    queryOptimizer.query(
      'waitlist_stats',
      async () => {
        const supabase = createClientSupabaseClient();
        const { count: total } = await supabase
          .from('waitlist_subscribers')
          .select('*', { count: 'exact', head: true });
        
        const { count: confirmed } = await supabase
          .from('waitlist_subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('confirmed', true);

        return { total: total || 0, confirmed: confirmed || 0 };
      },
      { cache: true, ttl: 2 * 60 * 1000 } // 2 minutes
    ),
}; 