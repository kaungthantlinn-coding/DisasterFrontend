import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  User,
  Shield,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  category: 'authentication' | 'user_management' | 'system' | 'data_access' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

interface ComplianceReport {
  period: string;
  totalEvents: number;
  securityEvents: number;
  dataAccessEvents: number;
  adminActions: number;
  failedAttempts: number;
  complianceScore: number;
}

const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock audit logs - replace with real API calls
  useEffect(() => {
    const mockLogs: AuditLog[] = [
      {
        id: 'log_001',
        timestamp: new Date().toISOString(),
        userId: 'admin_001',
        userName: 'Super Admin',
        userRole: 'super_admin',
        action: 'USER_CREATED',
        resource: 'User',
        resourceId: 'user_123',
        details: 'Created new user account for John Doe',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        status: 'success',
        category: 'user_management',
        severity: 'medium',
        metadata: {
          newUserEmail: 'john.doe@disaster.gov',
          assignedRoles: ['user']
        }
      },
      {
        id: 'log_002',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        userId: 'user_456',
        userName: 'Jane Smith',
        userRole: 'admin',
        action: 'LOGIN_FAILED',
        resource: 'Authentication',
        details: 'Failed login attempt - invalid password',
        ipAddress: '10.0.0.50',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X)',
        status: 'failure',
        category: 'authentication',
        severity: 'high',
        metadata: {
          attemptCount: 3,
          reason: 'invalid_password'
        }
      },
      {
        id: 'log_003',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        userId: 'admin_002',
        userName: 'System Admin',
        userRole: 'admin',
        action: 'SYSTEM_CONFIG_CHANGED',
        resource: 'SystemSettings',
        resourceId: 'security_policy',
        details: 'Updated password policy requirements',
        ipAddress: '172.16.0.25',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        status: 'success',
        category: 'system',
        severity: 'critical',
        metadata: {
          oldPolicy: { minLength: 8, requireSpecialChars: false },
          newPolicy: { minLength: 12, requireSpecialChars: true }
        }
      },
      {
        id: 'log_004',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userId: 'user_789',
        userName: 'Data Analyst',
        userRole: 'user',
        action: 'DATA_EXPORT',
        resource: 'UserData',
        details: 'Exported user report data',
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status: 'success',
        category: 'data_access',
        severity: 'medium',
        metadata: {
          recordCount: 150,
          exportFormat: 'CSV'
        }
      },
      {
        id: 'log_005',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        userId: 'unknown',
        userName: 'Unknown User',
        userRole: 'unknown',
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        resource: 'AdminPanel',
        details: 'Attempted to access admin panel without proper authorization',
        ipAddress: '203.0.113.1',
        userAgent: 'curl/7.68.0',
        status: 'failure',
        category: 'security',
        severity: 'critical',
        metadata: {
          blockedBy: 'firewall',
          threatLevel: 'high'
        }
      }
    ];

    setLogs(mockLogs);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failure': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Shield className="h-4 w-4" />;
      case 'user_management': return <User className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'data_access': return <Database className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setShowLogDialog(true);
  };

  const handleExport = () => {
    // Simulate export functionality
    const csvContent = [
      'Timestamp,User,Action,Resource,Status,IP Address,Details',
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.userName}","${log.action}","${log.resource}","${log.status}","${log.ipAddress}","${log.details}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const complianceReport: ComplianceReport = {
    period: 'Last 7 days',
    totalEvents: logs.length,
    securityEvents: logs.filter(l => l.category === 'security').length,
    dataAccessEvents: logs.filter(l => l.category === 'data_access').length,
    adminActions: logs.filter(l => l.userRole === 'admin' || l.userRole === 'super_admin').length,
    failedAttempts: logs.filter(l => l.status === 'failure').length,
    complianceScore: 85
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Comprehensive audit trail and compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Report</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="user_management">User Management</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="data_access">Data Access</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failure">Failure</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity</label>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Events ({filteredLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-sm text-muted-foreground">{log.userRole}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="text-sm">{log.action.replace(/_/g, ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{log.resource}</div>
                        {log.resourceId && (
                          <div className="text-xs text-muted-foreground font-mono">{log.resourceId}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className="text-sm capitalize">{log.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">{log.ipAddress}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compliance Score</span>
                  <span className="text-2xl font-bold text-green-600">{complianceReport.complianceScore}%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Events</span>
                    <span>{complianceReport.totalEvents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Security Events</span>
                    <span>{complianceReport.securityEvents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Failed Attempts</span>
                    <span>{complianceReport.failedAttempts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Access Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{complianceReport.dataAccessEvents}</div>
                    <div className="text-sm text-muted-foreground">Data access events</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    All data access events are logged and monitored for compliance with data protection regulations.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Administrative Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{complianceReport.adminActions}</div>
                    <div className="text-sm text-muted-foreground">Admin actions logged</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    All administrative actions are tracked for accountability and audit purposes.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Log Details Dialog */}
      <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected audit event
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="text-sm">{format(new Date(selectedLog.timestamp), 'PPpp')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Event ID</label>
                  <p className="text-sm font-mono">{selectedLog.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User</label>
                  <p className="text-sm">{selectedLog.userName} ({selectedLog.userRole})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Action</label>
                  <p className="text-sm">{selectedLog.action.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Resource</label>
                  <p className="text-sm">{selectedLog.resource}</p>
                  {selectedLog.resourceId && (
                    <p className="text-xs text-muted-foreground font-mono">{selectedLog.resourceId}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedLog.status)}
                    <span className="text-sm capitalize">{selectedLog.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                  <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severity</label>
                  {getSeverityBadge(selectedLog.severity)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Details</label>
                <p className="text-sm mt-1">{selectedLog.details}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                <p className="text-xs font-mono text-muted-foreground mt-1">{selectedLog.userAgent}</p>
              </div>
              
              {selectedLog.metadata && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Metadata</label>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogViewer;
