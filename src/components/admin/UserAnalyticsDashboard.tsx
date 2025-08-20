import React, { useState, useMemo } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

import { useUserManagement } from '../../hooks/useUserManagement';

interface UserActivityData {
  date: string;
  activeUsers: number;
  newRegistrations: number;
  loginAttempts: number;
  failedLogins: number;
}

interface DeviceStats {
  device: string;
  count: number;
  percentage: number;
}

interface LocationStats {
  country: string;
  city: string;
  count: number;
  percentage: number;
}

interface SecurityEvent {
  id: string;
  userId: string;
  userName: string;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  ipAddress: string;
  location: string;
}

const UserAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const { stats, isLoadingStats } = useUserManagement();

  // Mock analytics data - replace with real API calls
  const activityData: UserActivityData[] = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = format(subDays(new Date(), days - i - 1), 'yyyy-MM-dd');
      return {
        date,
        activeUsers: Math.floor(Math.random() * 200) + 50,
        newRegistrations: Math.floor(Math.random() * 20) + 2,
        loginAttempts: Math.floor(Math.random() * 500) + 100,
        failedLogins: Math.floor(Math.random() * 50) + 5,
      };
    });
  }, [timeRange]);

  const deviceStats: DeviceStats[] = [
    { device: 'Desktop', count: 1250, percentage: 62.5 },
    { device: 'Mobile', count: 600, percentage: 30.0 },
    { device: 'Tablet', count: 150, percentage: 7.5 },
  ];

  const locationStats: LocationStats[] = [
    { country: 'Myanmar', city: 'Yangon', count: 850, percentage: 42.5 },
    { country: 'Myanmar', city: 'Mandalay', count: 400, percentage: 20.0 },
    { country: 'Myanmar', city: 'Naypyidaw', count: 300, percentage: 15.0 },
    { country: 'Thailand', city: 'Bangkok', count: 200, percentage: 10.0 },
    { country: 'Singapore', city: 'Singapore', count: 150, percentage: 7.5 },
    { country: 'Others', city: 'Various', count: 100, percentage: 5.0 },
  ];

  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      userId: 'user123',
      userName: 'John Doe',
      event: 'Multiple failed login attempts',
      severity: 'high',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100',
      location: 'Yangon, Myanmar',
    },
    {
      id: '2',
      userId: 'user456',
      userName: 'Jane Smith',
      event: 'Login from new device',
      severity: 'medium',
      timestamp: subDays(new Date(), 1).toISOString(),
      ipAddress: '10.0.0.50',
      location: 'Bangkok, Thailand',
    },
    {
      id: '3',
      userId: 'user789',
      userName: 'Admin User',
      event: 'Privilege escalation attempt',
      severity: 'critical',
      timestamp: subDays(new Date(), 2).toISOString(),
      ipAddress: '172.16.0.25',
      location: 'Singapore',
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
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

  const totalActiveUsers = activityData.reduce((sum, day) => sum + day.activeUsers, 0);
  const avgActiveUsers = Math.round(totalActiveUsers / activityData.length);
  const totalNewUsers = activityData.reduce((sum, day) => sum + day.newRegistrations, 0);
  const totalLoginAttempts = activityData.reduce((sum, day) => sum + day.loginAttempts, 0);
  const totalFailedLogins = activityData.reduce((sum, day) => sum + day.failedLogins, 0);
  const successRate = ((totalLoginAttempts - totalFailedLogins) / totalLoginAttempts * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into user behavior and system security
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{totalNewUsers} this period
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgActiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              Daily average this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalLoginAttempts} total attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Daily Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>

            {/* Registration Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Registration Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityData.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(day.date), 'MMM dd')}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={(day.newRegistrations / 20) * 100} className="w-20" />
                        <span className="text-sm font-medium w-8">{day.newRegistrations}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Device Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceStats.map((device) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {device.device === 'Desktop' && <Monitor className="h-4 w-4" />}
                        {device.device === 'Mobile' && <Smartphone className="h-4 w-4" />}
                        {device.device === 'Tablet' && <Smartphone className="h-4 w-4" />}
                        <span className="text-sm font-medium">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={device.percentage} className="w-20" />
                        <span className="text-sm text-muted-foreground w-12">
                          {device.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locationStats.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{location.city}</div>
                        <div className="text-xs text-muted-foreground">{location.country}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={location.percentage} className="w-16" />
                        <span className="text-sm text-muted-foreground w-8">
                          {location.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.userName}</div>
                          <div className="text-sm text-muted-foreground">{event.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{event.event}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{event.location}</div>
                          <div className="text-xs text-muted-foreground">{event.ipAddress}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(event.timestamp), 'MMM dd, HH:mm')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Active User Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Active session monitoring would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAnalyticsDashboard;
