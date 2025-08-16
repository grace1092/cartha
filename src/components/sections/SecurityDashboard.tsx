'use client'

import { useState } from 'react'
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  FileText,
  Database,
  Key,
  Activity,
  BarChart3,
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  Edit,
  Download,
  RefreshCw,
  Zap,
  Users,
  Calendar,
  Bell,
  Settings
} from 'lucide-react'

interface SecurityDashboardProps {
  onClose?: () => void;
}

export default function SecurityDashboard({ onClose }: SecurityDashboardProps) {
  const [currentView, setCurrentView] = useState('overview')
  const [lastScan, setLastScan] = useState(new Date())
  const [securityScore, setSecurityScore] = useState(98)

  const complianceStatus = {
    hipaa: { status: 'compliant', lastAudit: '2024-01-15', nextAudit: '2024-07-15', score: 100 },
    soc2: { status: 'compliant', lastAudit: '2024-01-20', nextAudit: '2024-07-20', score: 98 },
    gdpr: { status: 'compliant', lastAudit: '2024-01-10', nextAudit: '2024-07-10', score: 95 },
    ssl: { status: 'active', lastCheck: '2024-02-19', nextCheck: '2024-02-26', score: 100 }
  }

  const encryptionStatus = {
    dataAtRest: { status: 'encrypted', algorithm: 'AES-256', lastUpdated: '2024-02-19' },
    dataInTransit: { status: 'encrypted', protocol: 'TLS 1.3', lastUpdated: '2024-02-19' },
    backups: { status: 'encrypted', algorithm: 'AES-256', lastUpdated: '2024-02-18' },
    api: { status: 'encrypted', protocol: 'HTTPS', lastUpdated: '2024-02-19' }
  }

  const auditTrail = [
    { timestamp: '2024-02-19 14:30:22', user: 'Dr. Smith', action: 'Viewed client file', client: 'Sarah Johnson', ip: '192.168.1.100', status: 'success' },
    { timestamp: '2024-02-19 14:25:15', user: 'Dr. Smith', action: 'Updated session notes', client: 'Mike Chen', ip: '192.168.1.100', status: 'success' },
    { timestamp: '2024-02-19 14:20:08', user: 'Admin', action: 'System backup completed', client: 'N/A', ip: '10.0.0.1', status: 'success' },
    { timestamp: '2024-02-19 14:15:33', user: 'Dr. Johnson', action: 'Failed login attempt', client: 'N/A', ip: '203.45.67.89', status: 'blocked' },
    { timestamp: '2024-02-19 14:10:45', user: 'Dr. Johnson', action: 'Successful login', client: 'N/A', ip: '192.168.1.101', status: 'success' },
    { timestamp: '2024-02-19 14:05:12', user: 'System', action: 'Security scan completed', client: 'N/A', ip: '10.0.0.1', status: 'success' }
  ]

  const threatPrevention = {
    blockedAttempts: 127,
    suspiciousActivities: 3,
    lastIncident: '2024-02-15',
    firewallStatus: 'active',
    antivirusStatus: 'updated',
    intrusionDetection: 'active'
  }

  const staffAccess = [
    { name: 'Dr. Sarah Smith', role: 'Therapist', permissions: ['view_clients', 'edit_notes', 'view_reports'], lastAccess: '2024-02-19 14:30', status: 'active' },
    { name: 'Dr. Mike Johnson', role: 'Therapist', permissions: ['view_clients', 'edit_notes'], lastAccess: '2024-02-19 14:10', status: 'active' },
    { name: 'Admin User', role: 'Administrator', permissions: ['all'], lastAccess: '2024-02-19 14:20', status: 'active' },
    { name: 'Dr. Lisa Chen', role: 'Therapist', permissions: ['view_clients', 'edit_notes'], lastAccess: '2024-02-19 13:45', status: 'inactive' }
  ]

  const clientConsent = [
    { client: 'Sarah Johnson', consentType: 'Treatment', status: 'active', date: '2024-01-15', expires: '2025-01-15' },
    { client: 'Mike Chen', consentType: 'Treatment', status: 'active', date: '2024-01-20', expires: '2025-01-20' },
    { client: 'Emma Davis', consentType: 'Treatment', status: 'active', date: '2024-01-10', expires: '2025-01-10' },
    { client: 'Alex Rodriguez', consentType: 'Treatment', status: 'expired', date: '2023-01-15', expires: '2024-01-15' }
  ]

  const securityAlerts = [
    { id: 1, type: 'info', message: 'Security scan completed successfully', timestamp: '2024-02-19 14:05', priority: 'low' },
    { id: 2, type: 'warning', message: 'Failed login attempt from unknown IP', timestamp: '2024-02-19 14:15', priority: 'medium' },
    { id: 3, type: 'success', message: 'SSL certificate renewed automatically', timestamp: '2024-02-19 12:00', priority: 'low' }
  ]

  const runSecurityScan = () => {
    setLastScan(new Date())
    setSecurityScore(prev => Math.min(100, prev + 1))
  }

  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-modal rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold">Security System Active!</h3>
                <p className="text-green-100">Enterprise-grade protection and compliance monitoring</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-green-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Impact Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">Bulletproof Security = Protected Practice</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">$50,000+</div>
                <div className="text-sm text-blue-100">HIPAA violations avoided</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-blue-100">Client trust maintained</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="p-6">
          {/* Security Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Security & Compliance Dashboard</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={runSecurityScan}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Run Scan</span>
                </button>
                <span className="text-sm text-gray-600">Last scan: {lastScan.toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Security Score */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{securityScore}%</div>
                  <div className="text-sm text-gray-600">Security Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">127</div>
                  <div className="text-sm text-gray-600">Threats Blocked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-600">Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            {['overview', 'compliance', 'encryption', 'audit', 'threats', 'access', 'consent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentView(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Views */}
          {currentView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Status */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Compliance Status</h4>
                <div className="space-y-4">
                  {Object.entries(complianceStatus).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          value.status === 'compliant' || value.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-gray-900">{key.toUpperCase()}</div>
                          <div className="text-sm text-gray-600">Score: {value.score}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 capitalize">{value.status}</div>
                        <div className="text-xs text-gray-600">Next: {'nextAudit' in value ? value.nextAudit : value.nextCheck}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Alerts */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Security Alerts</h4>
                <div className="space-y-3">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'success' ? 'border-green-500 bg-green-50' :
                      alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                           alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                           <Bell className="w-4 h-4 text-blue-600" />}
                          <span className="text-sm font-medium text-gray-900">{alert.message}</span>
                        </div>
                        <span className="text-xs text-gray-600">{alert.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'compliance' && (
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Compliance Monitoring</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">HIPAA Compliance</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Privacy Rule</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Security Rule</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Breach Notification</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Business Associate Agreements</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">SOC 2 Type II</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Security</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Availability</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Processing Integrity</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Confidentiality</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'encryption' && (
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Data Encryption Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(encryptionStatus).map(([key, value]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        value.status === 'encrypted' || value.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {value.status}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Algorithm/Protocol:</strong> {'algorithm' in value ? value.algorithm : value.protocol}</p>
                      <p><strong>Last Updated:</strong> {value.lastUpdated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'audit' && (
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Audit Trail</h4>
              <div className="space-y-3">
                {auditTrail.map((entry, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{entry.timestamp}</span>
                        <span className="text-sm text-gray-600">{entry.user}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        entry.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>Action:</strong> {entry.action}</p>
                      <p><strong>Client:</strong> {entry.client}</p>
                      <p><strong>IP Address:</strong> {entry.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'threats' && (
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Threat Prevention</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Security Metrics</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Blocked Attempts</span>
                      <span className="text-lg font-bold text-red-600">{threatPrevention.blockedAttempts}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Suspicious Activities</span>
                      <span className="text-lg font-bold text-yellow-600">{threatPrevention.suspiciousActivities}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Last Incident</span>
                      <span className="text-sm text-green-600">{threatPrevention.lastIncident}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Security Systems</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Firewall</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Antivirus</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Intrusion Detection</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'access' && (
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Staff Access Controls</h4>
              <div className="space-y-4">
                {staffAccess.map((staff, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-600">{staff.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {staff.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Permissions:</strong> {staff.permissions.join(', ')}</p>
                      <p><strong>Last Access:</strong> {staff.lastAccess}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'consent' && (
            <div className="bg-white rounded-lg border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Client Consent Management</h4>
              <div className="space-y-4">
                {clientConsent.map((consent, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{consent.client}</div>
                          <div className="text-sm text-gray-600">{consent.consentType}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          consent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {consent.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Date Signed:</strong> {consent.date}</p>
                      <p><strong>Expires:</strong> {consent.expires}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 