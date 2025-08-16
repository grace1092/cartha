# HIPAA Compliant Data Storage System

## Overview

This document describes the comprehensive HIPAA-compliant data storage system implemented in CARTHA, a healthcare therapy practice management platform. The system ensures full compliance with HIPAA (Health Insurance Portability and Accountability Act) requirements for protecting patient health information (PHI).

## Features

### 🔐 Security & Authentication
- **Multi-Factor Authentication (MFA)**: Optional 2FA for enhanced account security
- **Session Management**: Configurable session timeouts and automatic logout
- **Account Lockout**: Automatic account locking after failed login attempts
- **Password Policies**: Enforced strong password requirements
- **Access Control**: Role-based permissions and data access controls

### 📋 Audit Logging
- **Comprehensive Tracking**: All data access, modifications, and system events logged
- **Real-time Monitoring**: Immediate logging of all user actions
- **Retention Compliance**: Audit logs retained for required periods
- **Search & Filter**: Advanced querying capabilities for compliance audits
- **Export Capabilities**: Audit log export for external review

### 💾 Data Backup & Recovery
- **Automated Backups**: Scheduled full, incremental, and differential backups
- **Encrypted Storage**: All backups encrypted with strong encryption
- **Geographic Redundancy**: Multi-region backup storage
- **Point-in-Time Recovery**: Ability to restore to specific points in time
- **Backup Verification**: Automated integrity checks and validation

### 🔄 Real-time Synchronization
- **Data Consistency**: Ensures data consistency across all systems
- **Conflict Resolution**: Automated and manual conflict resolution
- **Performance Optimization**: Efficient sync algorithms
- **Health Monitoring**: Real-time sync status and health metrics
- **Error Recovery**: Automatic retry mechanisms and error handling

### 📤 Data Export & Portability
- **Multiple Formats**: JSON, CSV, XML, PDF, and encrypted ZIP exports
- **Selective Export**: Choose specific data types and date ranges
- **Encryption**: Optional encryption for sensitive data exports
- **Access Controls**: Permission-based export restrictions
- **Audit Trail**: Complete tracking of all export activities

### 🛡️ Privacy & Compliance
- **Data Retention**: Configurable retention policies per data type
- **Right to Deletion**: Support for data deletion requests
- **Data Minimization**: Only collect and store necessary data
- **Consent Management**: Track and manage user consent
- **Privacy Notices**: Automated privacy policy updates

## Architecture

### Database Schema

The HIPAA compliance system extends the existing database with the following new tables:

#### Core Tables
- `audit_logs`: Comprehensive audit trail of all system activities
- `data_backups`: Backup job tracking and metadata
- `data_exports`: Export job management and tracking
- `sync_logs`: Real-time synchronization status and history
- `encryption_keys`: Encryption key management
- `retention_policies`: Data retention policy configuration
- `user_sessions`: User session tracking and management
- `data_permissions`: Granular data access permissions
- `security_incidents`: Security incident tracking and response

#### Configuration Tables
- `backup_configs`: Backup schedule and configuration
- `sync_configs`: Synchronization settings and policies
- `export_templates`: Predefined export configurations

### Security Layers

1. **Application Layer**: Authentication, authorization, and session management
2. **Data Layer**: Encryption, access controls, and audit logging
3. **Infrastructure Layer**: Network security, backup encryption, and monitoring
4. **Compliance Layer**: Policy enforcement, retention management, and reporting

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Supabase project with service role key
- Environment variables configured

### Quick Setup

1. **Run the setup script**:
   ```bash
   node scripts/setup-hipaa.js
   ```

2. **Verify installation**:
   ```bash
   npm run verify-hipaa
   ```

3. **Configure environment variables**:
   ```env
   # Required for HIPAA compliance
   HIPAA_ENCRYPTION_ENABLED=true
   HIPAA_AUDIT_LOGGING_ENABLED=true
   HIPAA_SESSION_TIMEOUT=30
   HIPAA_MAX_LOGIN_ATTEMPTS=5
   HIPAA_LOCKOUT_DURATION=15
   ```

### Manual Setup

If you prefer manual setup, follow these steps:

1. **Run the migration**:
   ```sql
   -- Execute the HIPAA migration
   \i supabase/migrations/20240104000000_hipaa_compliant_data_storage.sql
   ```

2. **Initialize encryption keys**:
   ```sql
   INSERT INTO encryption_keys (key_id, key_type, encrypted_key, key_version, is_active)
   VALUES 
     ('master_key_v1', 'master', 'encrypted_master_key', 1, true),
     ('data_key_v1', 'data', 'encrypted_data_key', 1, true),
     ('backup_key_v1', 'backup', 'encrypted_backup_key', 1, true),
     ('export_key_v1', 'export', 'encrypted_export_key', 1, true);
   ```

3. **Configure retention policies**:
   ```sql
   INSERT INTO retention_policies (table_name, data_type, retention_period_days, retention_action, is_active)
   VALUES 
     ('clients', 'phi', 2555, 'archive', true),
     ('therapy_sessions', 'phi', 2555, 'archive', true),
     ('client_files', 'phi', 2555, 'archive', true),
     ('audit_logs', 'security', 2555, 'archive', true);
   ```

## Configuration

### Authentication Settings

```typescript
// Configure authentication settings
const authConfig = {
  sessionTimeout: 30, // minutes
  maxFailedAttempts: 5,
  lockoutDuration: 15, // minutes
  requireTwoFactor: false, // optional
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
};
```

### Backup Configuration

```typescript
// Configure backup settings
const backupConfig = {
  schedule: {
    daily: { time: '02:00', type: 'full' },
    weekly: { day: 'sunday', time: '03:00', type: 'incremental' },
    monthly: { day: 1, time: '04:00', type: 'full' }
  },
  retention: {
    daily: 30, // days
    weekly: 90, // days
    monthly: 365 // days
  },
  encryption: true,
  compression: true
};
```

### Audit Logging Configuration

```typescript
// Configure audit logging
const auditConfig = {
  enabled: true,
  retentionDays: 2555, // 7 years
  logLevel: 'detailed', // basic, detailed, verbose
  includeMetadata: true,
  realTimeAlerts: true
};
```

## Usage

### Authentication

```typescript
import { hipaaAuth } from '@/lib/auth/hipaaAuth';

// Sign in with optional 2FA
const { user, error } = await hipaaAuth.signIn(
  'user@example.com',
  'password',
  '123456' // 2FA code (optional)
);

// Check session validity
const { valid, user } = await hipaaAuth.validateSession(sessionToken);

// Enable 2FA
const { secret, qrCode, error } = await hipaaAuth.enableTwoFactor(userId);
```

### Data Access Control

```typescript
// Check data access permissions
const hasAccess = await hipaaAuth.checkDataAccess(
  userId,
  'clients',
  clientId,
  'read'
);

// Grant permissions
await hipaaAuth.grantDataPermission(
  userId,
  'clients',
  clientId,
  'read',
  grantedBy
);
```

### Audit Logging

```typescript
// Log audit events
await hipaaAuth.logAuditEvent(
  'clients',
  clientId,
  'read',
  oldData,
  newData
);

// Retrieve audit logs
const logs = await hipaaAuth.getAuditLogs(
  userId,
  'clients',
  startDate,
  endDate,
  100
);
```

### Backup Management

```typescript
import { backupService } from '@/lib/services/backupService';

// Create manual backup
const { backupId, error } = await backupService.createBackup(
  'Manual-Backup-2024-01-01',
  'full'
);

// Get backup status
const backup = await backupService.getBackup(backupId);

// Restore from backup
const { restoreId, error } = await backupService.restoreBackup(
  backupId,
  'target-database'
);
```

### Data Export

```typescript
import { exportService } from '@/lib/services/exportService';

// Request data export
const { exportId, error } = await exportService.requestExport(
  userId,
  'client_data',
  'json',
  { dateFrom: '2024-01-01', dateTo: '2024-12-31' }
);

// Download export
const { data, error } = await exportService.downloadExport(exportId);

// Get export templates
const templates = await exportService.getExportTemplates(userId);
```

### Real-time Sync

```typescript
import { syncService } from '@/lib/services/syncService';

// Sync specific table
const { success, syncedCount, error } = await syncService.syncTable('clients');

// Get sync health
const health = await syncService.getSyncHealth();

// Check data consistency
const { consistent, issues } = await syncService.checkDataConsistency('clients');
```

## API Endpoints

### Audit Logs
- `GET /api/hipaa/audit-logs` - Retrieve audit logs
- `POST /api/hipaa/audit-logs` - Log audit event

### Backups
- `GET /api/hipaa/backups` - List backups
- `POST /api/hipaa/backups` - Create backup
- `GET /api/hipaa/backups/[id]` - Get backup details
- `POST /api/hipaa/backups/[id]/restore` - Restore backup

### Exports
- `GET /api/hipaa/exports` - List exports
- `POST /api/hipaa/exports` - Request export
- `GET /api/hipaa/exports/[id]` - Download export
- `DELETE /api/hipaa/exports/[id]` - Delete export

### Sync
- `GET /api/hipaa/sync/health` - Get sync health
- `POST /api/hipaa/sync/[table]` - Sync table
- `GET /api/hipaa/sync/conflicts` - List conflicts
- `POST /api/hipaa/sync/conflicts/[id]/resolve` - Resolve conflict

## Monitoring & Maintenance

### Health Checks

```typescript
// Check system health
const health = {
  audit: await hipaaAuth.getAuditHealth(),
  backup: await backupService.getBackupHealth(),
  sync: await syncService.getSyncHealth(),
  export: await exportService.getExportAnalytics()
};
```

### Automated Tasks

Set up the following cron jobs for maintenance:

```bash
# Daily cleanup
0 2 * * * node scripts/cleanup-expired-sessions.js
0 3 * * * node scripts/cleanup-expired-exports.js
0 4 * * * node scripts/enforce-retention-policies.js

# Weekly maintenance
0 5 * * 0 node scripts/cleanup-expired-backups.js
0 6 * * 0 node scripts/verify-backup-integrity.js

# Monthly tasks
0 7 1 * * node scripts/generate-compliance-report.js
```

### Compliance Reporting

```typescript
// Generate compliance report
const report = {
  period: '2024-01-01 to 2024-12-31',
  dataAccess: {
    totalAccess: 15420,
    authorizedAccess: 15418,
    unauthorizedAttempts: 2,
    complianceRate: 99.99
  },
  backups: {
    totalBackups: 365,
    successfulBackups: 364,
    failedBackups: 1,
    successRate: 99.73
  },
  exports: {
    totalExports: 45,
    encryptedExports: 45,
    complianceRate: 100
  },
  incidents: {
    totalIncidents: 0,
    resolvedIncidents: 0,
    openIncidents: 0
  }
};
```

## Security Best Practices

### 1. Access Control
- Implement principle of least privilege
- Regular access reviews and updates
- Multi-factor authentication for all admin accounts
- Session timeout for inactive users

### 2. Data Protection
- Encrypt all PHI at rest and in transit
- Use strong encryption algorithms (AES-256)
- Regular key rotation and management
- Secure key storage and access

### 3. Monitoring
- Real-time monitoring of all data access
- Automated alerts for suspicious activities
- Regular security assessments and audits
- Incident response procedures

### 4. Backup & Recovery
- Regular backup testing and validation
- Geographic redundancy for backups
- Secure backup storage and access
- Documented recovery procedures

### 5. Compliance
- Regular HIPAA compliance audits
- Updated privacy policies and procedures
- Staff training on HIPAA requirements
- Incident reporting and response

## Troubleshooting

### Common Issues

1. **Audit Logging Not Working**
   - Check database permissions
   - Verify RLS policies are enabled
   - Check audit trigger functions

2. **Backup Failures**
   - Verify storage permissions
   - Check encryption key availability
   - Review backup configuration

3. **Sync Conflicts**
   - Check network connectivity
   - Review conflict resolution policies
   - Verify data integrity

4. **Export Issues**
   - Check file size limits
   - Verify encryption key access
   - Review export permissions

### Debug Commands

```bash
# Check system status
npm run hipaa:status

# Verify database schema
npm run hipaa:verify-schema

# Test backup functionality
npm run hipaa:test-backup

# Check audit logging
npm run hipaa:test-audit

# Validate encryption
npm run hipaa:test-encryption
```

## Support

For technical support and compliance questions:

- **Technical Issues**: Create an issue in the GitHub repository
- **Compliance Questions**: Contact the compliance team
- **Security Incidents**: Follow the incident response procedure
- **Documentation**: Review this document and related guides

## Compliance Checklist

- [ ] HIPAA migration executed successfully
- [ ] Encryption keys configured and secured
- [ ] Audit logging enabled and tested
- [ ] Backup procedures configured and tested
- [ ] Retention policies implemented
- [ ] Access controls configured
- [ ] Staff training completed
- [ ] Incident response procedures documented
- [ ] Regular compliance audits scheduled
- [ ] Privacy policies updated
- [ ] Security assessments completed
- [ ] Monitoring and alerting configured

## Version History

- **v1.0.0** (2024-01-04): Initial HIPAA compliance implementation
  - Basic audit logging
  - Data backup and recovery
  - Real-time synchronization
  - Data export functionality
  - Access control and permissions

## License

This HIPAA compliance system is part of the CARTHA platform and is subject to the same licensing terms as the main application. 