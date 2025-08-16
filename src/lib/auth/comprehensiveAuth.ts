import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { hipaaAuth } from './hipaaAuth';
import crypto from 'crypto';

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  resource_type: string;
  resource_id: string | null;
  action: 'read' | 'write' | 'delete' | 'admin';
  granted_by: string;
  granted_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface SecurityEvent {
  id: string;
  user_id: string | null;
  event_type: 'login' | 'logout' | 'password_change' | 'permission_change' | 'suspicious_activity' | 'data_access' | 'export_request' | 'backup_request';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string;
  user_agent: string;
  location: string | null;
  details: any;
  timestamp: string;
}

export interface SessionInfo {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string;
  user_agent: string;
  location: string | null;
  device_fingerprint: string;
  is_active: boolean;
  created_at: string;
  last_activity: string;
  expires_at: string;
}

export class ComprehensiveAuthService {
  private supabase;
  private sessionTimeout: number = 30; // minutes
  private maxConcurrentSessions: number = 5;
  private suspiciousActivityThreshold: number = 10; // events per hour

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Enhanced Authentication
  async authenticateUser(
    email: string, 
    password: string, 
    twoFactorCode?: string,
    deviceFingerprint?: string
  ): Promise<{ user: any; session: SessionInfo | null; error: string | null }> {
    try {
      // Check for suspicious activity
      const suspiciousCheck = await this.checkSuspiciousActivity(email);
      if (suspiciousCheck.suspicious) {
        await this.logSecurityEvent(email, 'suspicious_activity', 'high', {
          reason: suspiciousCheck.reason,
          activity_count: suspiciousCheck.count
        });
        return { user: null, session: null, error: 'Account temporarily locked due to suspicious activity' };
      }

      // Attempt authentication
      const authResult = await hipaaAuth.signIn(email, password, twoFactorCode);
      if (authResult.error) {
        return { user: authResult.user, session: null, error: authResult.error };
      }

      // Create enhanced session
      const session = await this.createEnhancedSession(authResult.user!.id, deviceFingerprint);
      
      // Log successful authentication
      await this.logSecurityEvent(authResult.user!.id, 'login', 'low', {
        session_id: session.id,
        device_fingerprint: deviceFingerprint
      });

      return { user: authResult.user, session, error: null };

    } catch (error) {
      console.error('Authentication error:', error);
      return { user: null, session: null, error: 'Authentication failed' };
    }
  }

  // Enhanced Session Management
  private async createEnhancedSession(userId: string, deviceFingerprint?: string): Promise<SessionInfo> {
    const sessionToken = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + this.sessionTimeout * 60 * 1000);
    const deviceFp = deviceFingerprint || this.generateDeviceFingerprint();

    // Check concurrent sessions limit
    await this.enforceSessionLimit(userId);

    const { data, error } = await this.supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        ip_address: this.getClientIP(),
        user_agent: this.getUserAgent(),
        device_fingerprint: deviceFp,
        location: await this.getLocationFromIP(),
        is_active: true,
        expires_at: expiresAt.toISOString(),
        last_activity: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      throw new Error('Failed to create session');
    }

    return data as SessionInfo;
  }

  async validateSession(sessionToken: string): Promise<{ valid: boolean; user: any; session: SessionInfo | null }> {
    try {
      const { data: session, error } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .single();

      if (error || !session) {
        return { valid: false, user: null, session: null };
      }

      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        await this.invalidateSession(session.id);
        return { valid: false, user: null, session: null };
      }

      // Update last activity
      await this.updateSessionActivity(session.id);

      // Get user data
      const user = await hipaaAuth.getUserProfile(session.user_id);
      
      return { valid: true, user, session: session as SessionInfo };

    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false, user: null, session: null };
    }
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await this.supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId);
  }

  // Role-Based Access Control
  async assignUserRole(userId: string, roleName: string, assignedBy: string): Promise<{ error: string | null }> {
    try {
      // Get role
      const { data: role } = await this.supabase
        .from('user_roles')
        .select('*')
        .eq('name', roleName)
        .single();

      if (!role) {
        return { error: 'Role not found' };
      }

      // Assign role to user
      const { error } = await this.supabase
        .from('user_role_assignments')
        .insert({
          user_id: userId,
          role_id: role.id,
          assigned_by: assignedBy,
          assigned_at: new Date().toISOString()
        });

      if (error) {
        return { error: error.message };
      }

      // Log role assignment
      await this.logSecurityEvent(userId, 'permission_change', 'medium', {
        role_name: roleName,
        assigned_by: assignedBy
      });

      return { error: null };

    } catch (error) {
      console.error('Assign role error:', error);
      return { error: 'Failed to assign role' };
    }
  }

  async checkPermission(
    userId: string,
    resourceType: string,
    resourceId: string | null,
    action: 'read' | 'write' | 'delete' | 'admin'
  ): Promise<boolean> {
    try {
      // Check user roles and permissions
      const { data: permissions } = await this.supabase
        .from('user_permissions')
        .select(`
          *,
          user_roles!inner(
            permissions
          )
        `)
        .eq('user_id', userId)
        .eq('resource_type', resourceType)
        .eq('action', action)
        .eq('is_active', true)
        .or(`resource_id.is.null,resource_id.eq.${resourceId}`);

      return Boolean(permissions && permissions.length > 0);

    } catch (error) {
      console.error('Check permission error:', error);
      return false;
    }
  }

  async grantPermission(
    userId: string,
    resourceType: string,
    resourceId: string | null,
    action: 'read' | 'write' | 'delete' | 'admin',
    grantedBy: string
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('user_permissions')
        .insert({
          user_id: userId,
          resource_type: resourceType,
          resource_id: resourceId,
          action: action,
          granted_by: grantedBy,
          granted_at: new Date().toISOString(),
          is_active: true
        });

      if (error) {
        return { error: error.message };
      }

      // Log permission grant
      await this.logSecurityEvent(userId, 'permission_change', 'medium', {
        resource_type: resourceType,
        resource_id: resourceId,
        action: action,
        granted_by: grantedBy
      });

      return { error: null };

    } catch (error) {
      console.error('Grant permission error:', error);
      return { error: 'Failed to grant permission' };
    }
  }

  // Security Monitoring
  private async checkSuspiciousActivity(email: string): Promise<{ suspicious: boolean; reason: string; count: number }> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data: events } = await this.supabase
        .from('security_events')
        .select('*')
        .eq('event_type', 'login')
        .gte('timestamp', oneHourAgo.toISOString())
        .eq('ip_address', this.getClientIP());

      const count = events?.length || 0;
      
      if (count >= this.suspiciousActivityThreshold) {
        return {
          suspicious: true,
          reason: 'Too many login attempts from same IP',
          count
        };
      }

      return { suspicious: false, reason: '', count };

    } catch (error) {
      console.error('Check suspicious activity error:', error);
      return { suspicious: false, reason: '', count: 0 };
    }
  }

  async logSecurityEvent(
    userId: string | null,
    eventType: SecurityEvent['event_type'],
    severity: SecurityEvent['severity'],
    details: any
  ): Promise<void> {
    try {
      await this.supabase
        .from('security_events')
        .insert({
          user_id: userId,
          event_type: eventType,
          severity: severity,
          ip_address: this.getClientIP(),
          user_agent: this.getUserAgent(),
          location: await this.getLocationFromIP(),
          details: details,
          timestamp: new Date().toISOString()
        });

    } catch (error) {
      console.error('Log security event error:', error);
    }
  }

  // Data Access Control
  async checkDataAccess(
    userId: string,
    tableName: string,
    recordId: string | null,
    action: 'read' | 'write' | 'delete' | 'export'
  ): Promise<boolean> {
    try {
      // Check basic HIPAA permissions
      const hipaaPermission = await hipaaAuth.checkDataAccess(userId, tableName, recordId, action);
      if (!hipaaPermission) {
        return false;
      }

      // Check additional role-based permissions
      const rolePermission = await this.checkPermission(userId, tableName, recordId, action as 'read' | 'write' | 'delete' | 'admin');
      
      return rolePermission;

    } catch (error) {
      console.error('Check data access error:', error);
      return false;
    }
  }

  // Session Management Utilities
  private async enforceSessionLimit(userId: string): Promise<void> {
    const { data: activeSessions } = await this.supabase
      .from('user_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (activeSessions && Array.isArray(activeSessions) && activeSessions.length >= this.maxConcurrentSessions) {
      // Invalidate oldest session
      const oldestSession = activeSessions[0];
      await this.invalidateSession(oldestSession.id);
    }
  }

  private async updateSessionActivity(sessionId: string): Promise<void> {
    await this.supabase
      .from('user_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', sessionId);
  }

  // Utility Functions
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private generateDeviceFingerprint(): string {
    const components = [
      this.getUserAgent(),
      this.getClientIP(),
      new Date().getTimezoneOffset(),
      screen?.width || 0,
      screen?.height || 0
    ];
    
    return crypto.createHash('sha256')
      .update(components.join('|'))
      .digest('hex');
  }

  private getClientIP(): string {
    // This would be implemented based on your server setup
    return '127.0.0.1';
  }

  private getUserAgent(): string {
    // This would be implemented based on your server setup
    return 'Unknown';
  }

  private async getLocationFromIP(): Promise<string | null> {
    // This would integrate with a geolocation service
    return null;
  }

  // Cleanup and Maintenance
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('user_sessions')
        .update({ is_active: false })
        .lt('expires_at', new Date().toISOString())
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      return data ? (data as any[]).length : 0;

    } catch (error) {
      console.error('Cleanup expired sessions error:', error);
      return 0;
    }
  }

  async getSecurityEvents(
    userId?: string,
    eventType?: string,
    severity?: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): Promise<SecurityEvent[]> {
    try {
      let query = this.supabase
        .from('security_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (eventType) {
        query = query.eq('event_type', eventType);
      }

      if (severity) {
        query = query.eq('severity', severity);
      }

      if (startDate) {
        query = query.gte('timestamp', startDate);
      }

      if (endDate) {
        query = query.lte('timestamp', endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get security events error:', error);
      return [];
    }
  }

  async getUserSessions(userId: string): Promise<SessionInfo[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];

    } catch (error) {
      console.error('Get user sessions error:', error);
      return [];
    }
  }
}

export const comprehensiveAuth = new ComprehensiveAuthService(); 