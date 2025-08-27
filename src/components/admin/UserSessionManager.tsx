import React, { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  X,
  Eye,
  Ban,
  RefreshCw,
  Download,
  Filter,
  Search,
  Wifi,
  WifiOff,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { toast } from 'sonner';

interface UserSession {
  sessionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  deviceName: string;
  browser: string;
  operatingSystem: string;
  ipAddress: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
  riskScore: number;
  flags: string[];
}

interface SecurityAlert {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  type: 'suspicious_location' | 'multiple_sessions' | 'unusual_activity' | 'failed_auth';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

const UserSessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockSessions: UserSession[] = [
      {
        sessionId: 'sess_001',
        userId: 'user_123',
        userName: 'John Doe',
        userEmail: 'john.doe@disaster.gov',
        deviceType: 'desktop',
        deviceName: 'Windows PC',
        browser: 'Chrome 120.0',
        operatingSystem: 'Windows 11',
        ipAddress: '192.168.1.100',
        location: {
          country: 'Myanmar',
          city: 'Yangon',
          region: 'Yangon Region',
        },
        loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isActive: true,
        riskScore: 2,
        flags: [],
      },
      {
        sessionId: 'sess_002',
        userId: 'user_456',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@disaster.gov',
        deviceType: 'mobile',
        deviceName: 'iPhone 14',
        browser: 'Safari 17.0',
        operatingSystem: 'iOS 17.1',
        ipAddress: '10.0.0.50',
        location: {
          country: 'Thailand',
          city: 'Bangkok',
          region: 'Bangkok',
        },
        loginTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        isActive: true,
        riskScore: 7,
        flags: ['unusual_location', 'new_device'],
      },
      {
        sessionId: 'sess_003',
        userId: 'user_789',
        userName: 'Admin User',
        userEmail: 'admin@disaster.gov',
        deviceType: 'tablet',
        deviceName: 'iPad Pro',
        browser: 'Safari 17.0',
        operatingSystem: 'iPadOS 17.1',
        ipAddress: '172.16.0.25',
        location: {
          country: 'Singapore',
          city: 'Singapore',
          region: 'Central Region',
        },
        loginTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        isActive: false,
        riskScore: 9,
        flags: ['admin_access', 'foreign_ip', 'multiple_attempts'],
      },
    ];

    const mockAlerts: SecurityAlert[] = [
      {
        id: 'alert_001',
        sessionId: 'sess_002',
        userId: 'user_456',
        userName: 'Jane Smith',
        type: 'suspicious_location',
        severity: 'medium',
        message: 'Login from unusual location detected',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        resolved: false,
      },
      {
        id: 'alert_002',
        sessionId: 'sess_003',
        userId: 'user_789',
        userName: 'Admin User',
        type: 'multiple_sessions',
        severity: 'high',
        message: 'Multiple concurrent admin sessions detected',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved: false,
      },
    ];

    setSessions(mockSessions);
    setAlerts(mockAlerts);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.ipAddress.includes(searchTerm);
    
    const matchesDevice = deviceFilter === 'all' || session.deviceType === deviceFilter;
    
    const matchesRisk = riskFilter === 'all' || 
      (riskFilter === 'low' && session.riskScore <= 3) ||
      (riskFilter === 'medium' && session.riskScore > 3 && session.riskScore <= 7) ||
      (riskFilter === 'high' && session.riskScore > 7);
    
    return matchesSearch && matchesDevice && matchesRisk;
  });

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore <= 3) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Low Risk</Badge>;
    } else if (riskScore <= 7) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>;
    } else {
      return <Badge variant="destructive">High Risk</Badge>;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      toast.success('Session terminated successfully');
    } catch (error) {
      toast.error('Failed to terminate session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSession = (session: UserSession) => {
    setSelectedSession(session);
    setShowSessionDialog(true);
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ));
      toast.success('Alert resolved');
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const activeSessions = sessions.filter(s => s.isActive).length;
  const highRiskSessions = sessions.filter(s => s.riskScore > 7).length;
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage active user sessions and security alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Sessions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskSessions}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unresolvedAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Unresolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">
              All time today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users or IPs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Device Type</label>
                  <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions Table */}
          <Card>
            <CardHeader>
              <CardTitle>User Sessions ({filteredSessions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.sessionId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{session.userName}</div>
                          <div className="text-sm text-muted-foreground">{session.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(session.deviceType)}
                          <div>
                            <div className="text-sm">{session.deviceName}</div>
                            <div className="text-xs text-muted-foreground">{session.browser}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <div className="text-sm">{session.location.city}</div>
                            <div className="text-xs text-muted-foreground">{session.ipAddress}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {session.isActive ? (
                            <><Wifi className="h-3 w-3 text-green-600" /><span className="text-green-600">Active</span></>
                          ) : (
                            <><WifiOff className="h-3 w-3 text-gray-400" /><span className="text-gray-400">Inactive</span></>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(session.riskScore)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(session.lastActivity), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewSession(session)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleTerminateSession(session.sessionId)}
                              className="text-destructive"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Terminate Session
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Alert key={alert.id} className={!alert.resolved ? 'border-orange-200' : 'border-gray-200'}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{alert.userName}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(alert.timestamp), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <p>{alert.message}</p>
                      </div>
                      {!alert.resolved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Session Details Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user session
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User</label>
                  <p className="text-sm">{selectedSession.userName}</p>
                  <p className="text-xs text-muted-foreground">{selectedSession.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Session ID</label>
                  <p className="text-sm font-mono">{selectedSession.sessionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Device</label>
                  <p className="text-sm">{selectedSession.deviceName}</p>
                  <p className="text-xs text-muted-foreground">{selectedSession.operatingSystem}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Browser</label>
                  <p className="text-sm">{selectedSession.browser}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                  <p className="text-sm font-mono">{selectedSession.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-sm">{selectedSession.location.city}, {selectedSession.location.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Login Time</label>
                  <p className="text-sm">{format(new Date(selectedSession.loginTime), 'PPpp')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                  <p className="text-sm">{format(new Date(selectedSession.lastActivity), 'PPpp')}</p>
                </div>
              </div>
              
              {selectedSession.flags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Security Flags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedSession.flags.map((flag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {flag.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSessionDialog(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedSession) {
                  handleTerminateSession(selectedSession.sessionId);
                  setShowSessionDialog(false);
                }
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Terminate Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSessionManager;
