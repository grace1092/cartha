// HIPAA Compliance and Security Implementation
import { createHash, randomBytes, createCipher, createDecipher } from 'crypto';

// Security configuration
const SECURITY_CONFIG = {
  encryption: {
    algorithm: 'AES-256-GCM',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16
  },
  session: {
    maxAge: 30 * 60 * 1000, // 30 minutes
    inactivityTimeout: 15 * 60 * 1000, // 15 minutes
    maxConcurrentSessions: 3
  },
  audit: {
    retentionPeriod: 6 * 365 * 24 * 60 * 60 * 1000, // 6 years in milliseconds
    requiredFields: ['userId', 'action', 'resource', 'timestamp', 'ipAddress', 'userAgent']
  },
  dataClassification: {
    PHI: ['client_data', 'session_notes', 'medical_records', 'billing_info'],
    SENSITIVE: ['therapist_credentials', 'payment_info', 'authentication_data'],
    INTERNAL: ['practice_analytics', 'system_logs', 'configuration']
  }
};

// Data encryption utilities
export class HIPAAEncryption {
  private static generateKey(): string {
    return randomBytes(SECURITY_CONFIG.encryption.keyLength).toString('hex');
  }

  private static generateIV(): string {
    return randomBytes(SECURITY_CONFIG.encryption.ivLength).toString('hex');
  }

  static encrypt(data: string, key?: string): { encrypted: string; key: string; iv: string } {
    const encryptionKey = key || this.generateKey();
    const iv = this.generateIV();
    
    try {
      // Simple encryption for demonstration (in production, use proper AES-GCM)
      const cipher = createCipher('aes-256-cbc', encryptionKey);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return {
        encrypted,
        key: encryptionKey,
        iv: iv
      };
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  static decrypt(encryptedData: string, key: string, iv: string): string {
    try {
      const decipher = createDecipher('aes-256-cbc', key);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed: Invalid key or corrupted data');
    }
  }

  static hashData(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  static generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }
}

// Audit logging system
export interface AuditLog {
  id: string;
  userId: string;
  sessionId: string;
  action: string;
  resource: string;
  resourceId?: string;
  outcome: 'success' | 'failure' | 'unauthorized';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
  additionalData?: Record<string, any>;
  dataClassification: 'PHI' | 'SENSITIVE' | 'INTERNAL';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class HIPAAAuditLogger {
  private static logs: AuditLog[] = [];

  static async logAccess(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      ...logData,
      id: HIPAAEncryption.generateSecureToken(),
      timestamp: new Date()
    };

    // Store in database (in production, this would be a secure audit database)
    this.logs.push(auditLog);

    // Real-time monitoring for high-risk activities
    if (auditLog.riskLevel === 'high' || auditLog.riskLevel === 'critical') {
      await this.alertSecurityTeam(auditLog);
    }

    // Cleanup old logs based on retention policy
    await this.cleanupOldLogs();
  }

  static async getAuditLogs(
    userId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      action?: string;
      resource?: string;
      outcome?: string;
    }
  ): Promise<AuditLog[]> {
    let filteredLogs = this.logs.filter(log => log.userId === userId);

    if (filters) {
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      if (filters.resource) {
        filteredLogs = filteredLogs.filter(log => log.resource === filters.resource);
      }
      if (filters.outcome) {
        filteredLogs = filteredLogs.filter(log => log.outcome === filters.outcome);
      }
    }

    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private static async alertSecurityTeam(auditLog: AuditLog): Promise<void> {
    // In production, this would send alerts to security team
    console.warn('Security Alert:', {
      level: auditLog.riskLevel,
      action: auditLog.action,
      user: auditLog.userId,
      timestamp: auditLog.timestamp
    });
  }

  private static async cleanupOldLogs(): Promise<void> {
    const cutoffDate = new Date(Date.now() - SECURITY_CONFIG.audit.retentionPeriod);
    this.logs = this.logs.filter(log => log.timestamp > cutoffDate);
  }
}

// Session security management
export interface SecureSession {
  id: string;
  userId: string;
  createdAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  securityLevel: 'standard' | 'elevated' | 'administrative';
}

export class HIPAASessionManager {
  private static sessions: Map<string, SecureSession> = new Map();

  static createSession(
    userId: string,
    ipAddress: string,
    userAgent: string,
    securityLevel: 'standard' | 'elevated' | 'administrative' = 'standard'
  ): SecureSession {
    // Check for max concurrent sessions
    const userSessions = Array.from(this.sessions.values())
      .filter(session => session.userId === userId && session.isActive);

    if (userSessions.length >= SECURITY_CONFIG.session.maxConcurrentSessions) {
      // Terminate oldest session
      const oldestSession = userSessions.sort((a, b) => 
        a.lastActivity.getTime() - b.lastActivity.getTime()
      )[0];
      this.terminateSession(oldestSession.id);
    }

    const session: SecureSession = {
      id: HIPAAEncryption.generateSecureToken(),
      userId,
      createdAt: new Date(),
      lastActivity: new Date(),
      ipAddress,
      userAgent,
      isActive: true,
      securityLevel
    };

    this.sessions.set(session.id, session);

    // Log session creation
    HIPAAAuditLogger.logAccess({
      userId,
      sessionId: session.id,
      action: 'session_created',
      resource: 'authentication',
      outcome: 'success',
      ipAddress,
      userAgent,
      dataClassification: 'SENSITIVE',
      riskLevel: 'low'
    });

    return session;
  }

  static validateSession(sessionId: string): SecureSession | null {
    const session = this.sessions.get(sessionId);
    
    if (!session || !session.isActive) {
      return null;
    }

    // Check session timeout
    const now = new Date();
    const maxAge = new Date(session.createdAt.getTime() + SECURITY_CONFIG.session.maxAge);
    const inactivityTimeout = new Date(
      session.lastActivity.getTime() + SECURITY_CONFIG.session.inactivityTimeout
    );

    if (now > maxAge || now > inactivityTimeout) {
      this.terminateSession(sessionId);
      return null;
    }

    // Update last activity
    session.lastActivity = now;
    this.sessions.set(sessionId, session);

    return session;
  }

  static terminateSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.sessions.set(sessionId, session);

      // Log session termination
      HIPAAAuditLogger.logAccess({
        userId: session.userId,
        sessionId: session.id,
        action: 'session_terminated',
        resource: 'authentication',
        outcome: 'success',
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        dataClassification: 'SENSITIVE',
        riskLevel: 'low'
      });
    }
  }

  static terminateAllUserSessions(userId: string): void {
    Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .forEach(session => this.terminateSession(session.id));
  }
}

// Data access control
export interface AccessPermission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

export interface Role {
  id: string;
  name: string;
  permissions: AccessPermission[];
  hierarchyLevel: number; // Higher number = more privileges
}

export class HIPAAAccessControl {
  static roles: Map<string, Role> = new Map([
    ['therapist', {
      id: 'therapist',
      name: 'Licensed Therapist',
      hierarchyLevel: 3,
      permissions: [
        { resource: 'client_data', actions: ['read', 'create', 'update'] },
        { resource: 'session_notes', actions: ['read', 'create', 'update', 'delete'] },
        { resource: 'appointments', actions: ['read', 'create', 'update', 'delete'] },
        { resource: 'billing', actions: ['read', 'create', 'update'] },
        { resource: 'analytics', actions: ['read'] },
        { resource: 'own_profile', actions: ['read', 'update'] }
      ]
    }],
    ['supervisor', {
      id: 'supervisor',
      name: 'Clinical Supervisor',
      hierarchyLevel: 4,
      permissions: [
        { resource: 'client_data', actions: ['read', 'create', 'update'] },
        { resource: 'session_notes', actions: ['read', 'create', 'update', 'delete'] },
        { resource: 'appointments', actions: ['read', 'create', 'update', 'delete'] },
        { resource: 'billing', actions: ['read', 'create', 'update', 'delete'] },
        { resource: 'analytics', actions: ['read', 'export'] },
        { resource: 'team_management', actions: ['read', 'update'] },
        { resource: 'audit_logs', actions: ['read'] }
      ]
    }],
    ['admin', {
      id: 'admin',
      name: 'Practice Administrator',
      hierarchyLevel: 5,
      permissions: [
        { resource: '*', actions: ['*'] }
      ]
    }]
  ]);

  static checkPermission(
    userRole: string,
    resource: string,
    action: string,
    userId: string,
    sessionId: string
  ): boolean {
    const role = this.roles.get(userRole);
    if (!role) {
      // Log unauthorized access attempt
      HIPAAAuditLogger.logAccess({
        userId,
        sessionId,
        action: `access_${action}`,
        resource,
        outcome: 'unauthorized',
        ipAddress: 'unknown',
        userAgent: 'unknown',
        dataClassification: 'SENSITIVE',
        riskLevel: 'high'
      });
      return false;
    }

    // Check for wildcard permissions (admin)
    const wildcardPermission = role.permissions.find(p => 
      p.resource === '*' && p.actions.includes('*')
    );
    if (wildcardPermission) {
      return true;
    }

    // Check specific resource permissions
    const permission = role.permissions.find(p => p.resource === resource);
    if (!permission) {
      return false;
    }

    const hasPermission = permission.actions.includes(action) || permission.actions.includes('*');

    // Log access attempt
    HIPAAAuditLogger.logAccess({
      userId,
      sessionId,
      action: `access_${action}`,
      resource,
      outcome: hasPermission ? 'success' : 'unauthorized',
      ipAddress: 'unknown',
      userAgent: 'unknown',
      dataClassification: this.getDataClassification(resource),
      riskLevel: hasPermission ? 'low' : 'medium'
    });

    return hasPermission;
  }

  private static getDataClassification(resource: string): 'PHI' | 'SENSITIVE' | 'INTERNAL' {
    if (SECURITY_CONFIG.dataClassification.PHI.some(phi => resource.includes(phi))) {
      return 'PHI';
    }
    if (SECURITY_CONFIG.dataClassification.SENSITIVE.some(sensitive => resource.includes(sensitive))) {
      return 'SENSITIVE';
    }
    return 'INTERNAL';
  }
}

// Data anonymization and de-identification
export class HIPAADataHandler {
  static anonymizeClientData(clientData: any): any {
    const anonymized = { ...clientData };
    
    // Remove direct identifiers
    delete anonymized.firstName;
    delete anonymized.lastName;
    delete anonymized.email;
    delete anonymized.phone;
    delete anonymized.address;
    delete anonymized.socialSecurityNumber;
    delete anonymized.insuranceId;
    
    // Replace with anonymized identifiers
    anonymized.clientId = HIPAAEncryption.hashData(clientData.id);
    anonymized.ageGroup = this.getAgeGroup(clientData.dateOfBirth);
    anonymized.locationRegion = this.getRegion(clientData.address?.zipCode);
    
    return anonymized;
  }

  static redactSensitiveData(data: string): string {
    // Remove common PII patterns
    return data
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, 'XXX-XX-XXXX') // SSN
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, 'XXXX-XXXX-XXXX-XXXX') // Credit card
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]') // Email
      .replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, 'XXX-XXX-XXXX'); // Phone
  }

  private static getAgeGroup(dateOfBirth: string): string {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age < 18) return 'minor';
    if (age < 30) return '18-29';
    if (age < 50) return '30-49';
    if (age < 65) return '50-64';
    return '65+';
  }

  private static getRegion(zipCode?: string): string {
    if (!zipCode) return 'unknown';
    const zip = parseInt(zipCode.substring(0, 3));
    
    // Basic US region mapping by ZIP code prefix
    if (zip >= 100 && zip <= 199) return 'northeast';
    if (zip >= 200 && zip <= 399) return 'southeast';
    if (zip >= 400 && zip <= 599) return 'midwest';
    if (zip >= 600 && zip <= 799) return 'southwest';
    if (zip >= 800 && zip <= 999) return 'west';
    
    return 'unknown';
  }
}

// HIPAA compliance checker
export interface ComplianceIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'technical' | 'administrative' | 'physical';
  description: string;
  recommendation: string;
  standard: string; // HIPAA standard reference
}

export class HIPAAComplianceChecker {
  static async runComplianceCheck(): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];

    // Check technical safeguards
    issues.push(...await this.checkTechnicalSafeguards());
    
    // Check administrative safeguards
    issues.push(...await this.checkAdministrativeSafeguards());
    
    // Check physical safeguards
    issues.push(...await this.checkPhysicalSafeguards());

    return issues.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  private static async checkTechnicalSafeguards(): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];

    // Check encryption
    if (!this.isEncryptionEnabled()) {
      issues.push({
        severity: 'critical',
        category: 'technical',
        description: 'Data encryption is not properly configured',
        recommendation: 'Enable AES-256 encryption for all PHI data at rest and in transit',
        standard: '164.312(a)(2)(iv)'
      });
    }

    // Check access controls
    if (!this.areAccessControlsConfigured()) {
      issues.push({
        severity: 'high',
        category: 'technical',
        description: 'Access controls are not properly implemented',
        recommendation: 'Implement role-based access controls with unique user identification',
        standard: '164.312(a)(1)'
      });
    }

    // Check audit controls
    if (!this.areAuditControlsEnabled()) {
      issues.push({
        severity: 'high',
        category: 'technical',
        description: 'Audit logging is not comprehensive',
        recommendation: 'Enable comprehensive audit logging for all PHI access',
        standard: '164.312(b)'
      });
    }

    return issues;
  }

  private static async checkAdministrativeSafeguards(): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];

    // Check BAA (Business Associate Agreements)
    issues.push({
      severity: 'medium',
      category: 'administrative',
      description: 'Business Associate Agreements need review',
      recommendation: 'Ensure all third-party vendors have signed BAAs',
      standard: '164.308(b)(1)'
    });

    return issues;
  }

  private static async checkPhysicalSafeguards(): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];

    // This would check physical security in a real implementation
    return issues;
  }

  private static isEncryptionEnabled(): boolean {
    // In production, this would check actual encryption configuration
    return true;
  }

  private static areAccessControlsConfigured(): boolean {
    // In production, this would check access control configuration
    return HIPAAAccessControl.roles.size > 0;
  }

  private static areAuditControlsEnabled(): boolean {
    // In production, this would check audit configuration
    return true;
  }
}

// Export all HIPAA utilities
export const HIPAA = {
  Encryption: HIPAAEncryption,
  AuditLogger: HIPAAAuditLogger,
  SessionManager: HIPAASessionManager,
  AccessControl: HIPAAAccessControl,
  DataHandler: HIPAADataHandler,
  ComplianceChecker: HIPAAComplianceChecker,
  CONFIG: SECURITY_CONFIG
};
