import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';

export interface HIPAAUser {
  id: string;
  email: string;
  full_name: string;
  hipaa_consent_date: string | null;
  hipaa_consent_version: string;
  data_retention_policy_accepted: boolean;
  two_factor_enabled: boolean;
  session_timeout_minutes: number;
  failed_login_attempts: number;
  account_locked_until: string | null;
  subscription_plan: 'starter' | 'professional' | 'enterprise';
  subscription_status: 'trial' | 'active' | 'canceled' | 'past_due';
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  session_id: string | null;
  table_name: string;
  record_id: string | null;
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'backup' | 'restore' | 'login' | 'logout' | 'password_change' | 'permission_change' | 'data_access';
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  metadata: any;
}

export interface DataPermission {
  id: string;
  user_id: string;
  table_name: string;
  record_id: string | null;
  permission_type: 'read' | 'write' | 'delete' | 'export';
  granted_by: string | null;
  granted_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export class HIPAAAuthService {
  private supabase;
  private sessionTimeout: number = 30; // minutes
  private maxFailedAttempts: number = 5;
  private lockoutDuration: number = 15; // minutes

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // User Authentication
  async signIn(email: string, password: string, twoFactorCode?: string): Promise<{ user: HIPAAUser | null; error: string | null }> {
    try {
      // Check if account is locked
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (profile?.account_locked_until && new Date(profile.account_locked_until) > new Date()) {
        return { user: null, error: 'Account temporarily locked due to failed login attempts' };
      }

      // Attempt sign in
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        await this.handleFailedLogin(email);
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Authentication failed' };
      }

      // Check 2FA if enabled
      if (profile?.two_factor_enabled && !twoFactorCode) {
        return { user: null, error: 'Two-factor authentication code required' };
      }

      if (profile?.two_factor_enabled && twoFactorCode) {
        const isValid2FA = await this.validateTwoFactorCode(authData.user.id, twoFactorCode);
        if (!isValid2FA) {
          await this.handleFailedLogin(email);
          return { user: null, error: 'Invalid two-factor authentication code' };
        }
      }

      // Reset failed login attempts
      await this.resetFailedLoginAttempts(email);

      // Create session
      const session = await this.createUserSession(authData.user.id);

      // Log successful login
      await this.logAuditEvent('profiles', authData.user.id, 'login', null, null);

      // Get user profile
      const user = await this.getUserProfile(authData.user.id);
      return { user, error: null };

    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: 'Authentication failed' };
    }
  }

  async signUp(email: string, password: string, fullName: string, hipaaConsent: boolean): Promise<{ user: HIPAAUser | null; error: string | null }> {
    try {
      if (!hipaaConsent) {
        return { user: null, error: 'HIPAA consent is required to create an account' };
      }

      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            hipaa_consent_date: new Date().toISOString(),
            hipaa_consent_version: '1.0',
            data_retention_policy_accepted: true,
            data_retention_accepted_date: new Date().toISOString(),
            last_privacy_review: new Date().toISOString(),
          }
        }
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Account creation failed' };
      }

      // Log account creation
      await this.logAuditEvent('profiles', authData.user.id, 'create', null, null);

      const user = await this.getUserProfile(authData.user.id);
      return { user, error: null };

    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: 'Account creation failed' };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (user) {
        // Log logout
        await this.logAuditEvent('profiles', user.id, 'logout', null, null);
        
        // Invalidate session
        await this.invalidateUserSession(user.id);
      }

      const { error } = await this.supabase.auth.signOut();
      return { error: error?.message || null };

    } catch (error) {
      console.error('Sign out error:', error);
      return { error: 'Sign out failed' };
    }
  }

  // Session Management
  private async createUserSession(userId: string): Promise<string> {
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + this.sessionTimeout * 60 * 1000);

    await this.supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        ip_address: this.getClientIP(),
        user_agent: this.getUserAgent(),
        expires_at: expiresAt.toISOString(),
      });

    return sessionToken;
  }

  private async invalidateUserSession(userId: string): Promise<void> {
    await this.supabase
      .from('user_sessions')
      .update({ 
        is_active: false,
        logout_reason: 'user_logout'
      })
      .eq('user_id', userId)
      .eq('is_active', true);
  }

  async validateSession(sessionToken: string): Promise<{ valid: boolean; user: HIPAAUser | null }> {
    try {
      const { data: session } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .single();

      if (!session || new Date(session.expires_at) < new Date()) {
        return { valid: false, user: null };
      }

      // Update last activity
      await this.supabase
        .from('user_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', session.id);

      const user = await this.getUserProfile(session.user_id);
      return { valid: true, user };

    } catch (error) {
      return { valid: false, user: null };
    }
  }

  // Two-Factor Authentication
  async enableTwoFactor(userId: string): Promise<{ secret: string; qrCode: string; error: string | null }> {
    try {
      // Generate 2FA secret (in production, use a proper 2FA library)
      const secret = this.generateTwoFactorSecret();
      const qrCode = this.generateQRCode(secret);

      await this.supabase
        .from('profiles')
        .update({ two_factor_enabled: true })
        .eq('id', userId);

      await this.logAuditEvent('profiles', userId, 'update', null, { two_factor_enabled: true });

      return { secret, qrCode, error: null };

    } catch (error) {
      console.error('Enable 2FA error:', error);
      return { secret: '', qrCode: '', error: 'Failed to enable two-factor authentication' };
    }
  }

  async disableTwoFactor(userId: string): Promise<{ error: string | null }> {
    try {
      await this.supabase
        .from('profiles')
        .update({ two_factor_enabled: false })
        .eq('id', userId);

      await this.logAuditEvent('profiles', userId, 'update', null, { two_factor_enabled: false });

      return { error: null };

    } catch (error) {
      console.error('Disable 2FA error:', error);
      return { error: 'Failed to disable two-factor authentication' };
    }
  }

  private async validateTwoFactorCode(userId: string, code: string): Promise<boolean> {
    // In production, implement proper 2FA validation
    // This is a placeholder implementation
    return code.length === 6 && /^\d+$/.test(code);
  }

  // Data Access Control
  async checkDataAccess(
    userId: string,
    tableName: string,
    recordId: string | null,
    permissionType: 'read' | 'write' | 'delete' | 'export'
  ): Promise<boolean> {
    try {
      const { data } = await this.supabase.rpc('check_data_access', {
        p_table_name: tableName,
        p_record_id: recordId,
        p_permission_type: permissionType
      });

      return data || false;

    } catch (error) {
      console.error('Data access check error:', error);
      return false;
    }
  }

  async grantDataPermission(
    userId: string,
    tableName: string,
    recordId: string | null,
    permissionType: 'read' | 'write' | 'delete' | 'export',
    grantedBy: string
  ): Promise<{ error: string | null }> {
    try {
      await this.supabase
        .from('data_permissions')
        .insert({
          user_id: userId,
          table_name: tableName,
          record_id: recordId,
          permission_type: permissionType,
          granted_by: grantedBy,
        });

      await this.logAuditEvent('data_permissions', userId, 'permission_change', null, {
          table_name: tableName,
          permission_type: permissionType
        });

      return { error: null };

    } catch (error) {
      console.error('Grant permission error:', error);
      return { error: 'Failed to grant permission' };
    }
  }

  async revokeDataPermission(permissionId: string): Promise<{ error: string | null }> {
    try {
      await this.supabase
        .from('data_permissions')
        .update({ is_active: false })
        .eq('id', permissionId);

      return { error: null };

    } catch (error) {
      console.error('Revoke permission error:', error);
      return { error: 'Failed to revoke permission' };
    }
  }

  // Audit Logging
  async logAuditEvent(
    tableName: string,
    recordId: string | null,
    action: AuditLogEntry['action'],
    oldValues: any = null,
    newValues: any = null
  ): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();

      await this.supabase.rpc('log_audit_event', {
        p_table_name: tableName,
        p_record_id: recordId,
        p_action: action,
        p_old_values: oldValues,
        p_new_values: newValues
      });

    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  async getAuditLogs(
    userId?: string,
    tableName?: string,
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): Promise<AuditLogEntry[]> {
    try {
      let query = this.supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (tableName) {
        query = query.eq('table_name', tableName);
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
      console.error('Get audit logs error:', error);
      return [];
    }
  }

  // Security Functions
  private async handleFailedLogin(email: string): Promise<void> {
    try {
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('failed_login_attempts')
        .eq('email', email)
        .single();

      if (profile) {
        const newAttempts = (profile.failed_login_attempts || 0) + 1;
        const updates: any = { failed_login_attempts: newAttempts };

        if (newAttempts >= this.maxFailedAttempts) {
          const lockoutUntil = new Date(Date.now() + this.lockoutDuration * 60 * 1000);
          updates.account_locked_until = lockoutUntil.toISOString();
        }

        await this.supabase
          .from('profiles')
          .update(updates)
          .eq('email', email);
      }
    } catch (error) {
      console.error('Handle failed login error:', error);
    }
  }

  private async resetFailedLoginAttempts(email: string): Promise<void> {
    try {
      await this.supabase
        .from('profiles')
        .update({ 
          failed_login_attempts: 0,
          account_locked_until: null
        })
        .eq('email', email);
    } catch (error) {
      console.error('Reset failed login attempts error:', error);
    }
  }

  // Utility Functions
  private generateSessionToken(): string {
    return crypto.randomUUID();
  }

  private generateTwoFactorSecret(): string {
    // In production, use a proper 2FA library
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateQRCode(secret: string): string {
    // In production, generate actual QR code
    return `otpauth://totp/CARTHA:${secret}?secret=${secret}&issuer=CARTHA`;
  }

  private getClientIP(): string {
    // In production, get actual client IP from request headers
    return '127.0.0.1';
  }

  private getUserAgent(): string {
    // In production, get actual user agent from request headers
    return 'Unknown';
  }

  // User Profile Management
  async getUserProfile(userId: string): Promise<HIPAAUser | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return data as HIPAAUser;

    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<HIPAAUser>): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        return { error: error.message };
      }

      await this.logAuditEvent('profiles', userId, 'update', null, updates);
      return { error: null };

    } catch (error) {
      console.error('Update user profile error:', error);
      return { error: 'Failed to update profile' };
    }
  }

  // Data Export and Privacy
  async requestDataExport(
    userId: string,
    exportType: string,
    format: 'json' | 'csv' | 'xml' | 'pdf' | 'encrypted_zip'
  ): Promise<{ exportId: string; error: string | null }> {
    try {
      const { data, error } = await this.supabase.rpc('initiate_data_export', {
        p_export_type: exportType,
        p_format: format,
        p_filters: {}
      });

      if (error) {
        return { exportId: '', error: error.message };
      }

      return { exportId: data, error: null };

    } catch (error) {
      console.error('Request data export error:', error);
      return { exportId: '', error: 'Failed to request data export' };
    }
  }

  async getUserDataSummary(userId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_data_summary', {
        p_user_id: userId
      });

      if (error) {
        throw error;
      }

      return data;

    } catch (error) {
      console.error('Get user data summary error:', error);
      return null;
    }
  }

  // Cleanup Functions
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const { data, error } = await this.supabase.rpc('cleanup_expired_sessions');
      
      if (error) {
        throw error;
      }

      return data || 0;

    } catch (error) {
      console.error('Cleanup expired sessions error:', error);
      return 0;
    }
  }

  async enforceRetentionPolicies(): Promise<number> {
    try {
      const { data, error } = await this.supabase.rpc('enforce_retention_policies');
      
      if (error) {
        throw error;
      }

      return data || 0;

    } catch (error) {
      console.error('Enforce retention policies error:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const hipaaAuth = new HIPAAAuthService(); 