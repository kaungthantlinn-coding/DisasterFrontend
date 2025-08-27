import React, { useState } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Users,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingDown,
  Settings
} from 'lucide-react';
import {
  AuditCategory,
  AuditSeverity,
  AUDIT_ACTION_DESCRIPTIONS
} from '../../types/audit';
import {
  useAuditLogs,
  useAuditLogStats,
  useExportAuditLogs,
  useSearchAuditLogs,
  useAuditLogFilter,
  useRealtimeAuditEvents
} from '../../hooks/useAudit';
import { SuperAdminGuard } from '../guards/PermissionGuard';

interface AuditLogDashboardProps {
  className?: string;
}

const AuditLogDashboard: React.FC<AuditLogDashboardProps> = ({ className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  const {
    filter,
    updateFilter,
    clearFilter,
    setDateRange: setFilterDateRange,
    hasActiveFilters
  } = useAuditLogFilter();

  const { data: auditLogs, isLoading, error, refetch } = useAuditLogs(
    filter,
    currentPage,
    pageSize
  );

  const { data: stats } = useAuditLogStats(filter);
  const { exportLogs, isExporting } = useExportAuditLogs();
  const { searchResults, isSearching, searchLogs, clearSearch } = useSearchAuditLogs();
  const { recentEvents, isConnected } = useRealtimeAuditEvents();

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchLogs(searchQuery, filter);
    } else {
      clearSearch();
    }
  };

  // Handle export
  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      await exportLogs({
        format,
        filter,
        includeDetails: true,
        dateRange: {
          start: dateRange.start,
          end: dateRange.end
        }
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Handle date range change
  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
    setFilterDateRange(
      format(startOfDay(new Date(start)), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      format(endOfDay(new Date(end)), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
    );
  };

  // Get severity badge color
  const getSeverityBadgeVariant = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.LOW:
        return 'default';
      case AuditSeverity.MEDIUM:
        return 'secondary';
      case AuditSeverity.HIGH:
        return 'destructive';
      case AuditSeverity.CRITICAL:
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: AuditCategory) => {
    switch (category) {
      case AuditCategory.USER_MANAGEMENT:
        return <Users className="h-4 w-4" />;
      case AuditCategory.ROLE_MANAGEMENT:
      case AuditCategory.PERMISSION_MANAGEMENT:
        return <Shield className="h-4 w-4" />;
      case AuditCategory.SYSTEM_ADMINISTRATION:
        return <Settings className="h-4 w-4" />;
      case AuditCategory.AUTHENTICATION:
        return <CheckCircle className="h-4 w-4" />;
      case AuditCategory.SECURITY:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Get success icon
  const getSuccessIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const displayLogs = searchResults?.entries || auditLogs?.entries || [];
  const totalCount = searchResults?.totalCount || auditLogs?.totalCount || 0;

  return (
    <SuperAdminGuard>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Log Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and analyze system activities and security events
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              <Activity className="h-3 w-3 mr-1" />
              {isConnected ? 'Live' : 'Offline'}
            </Badge>
            <Button onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEntries.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {recentEvents.length} new in last hour
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failure Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.failureRate * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.failureRate < 0.05 ? 'Low' : stats.failureRate < 0.15 ? 'Medium' : 'High'} risk level
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageResponseTime}ms</div>
                <p className="text-xs text-muted-foreground">
                  System performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Actors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.topActors.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active users today
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Search & Filter</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      Active
                    </Badge>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isExporting}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      CSV Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('json')}>
                      JSON Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      PDF Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search audit logs..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {(searchResults || hasActiveFilters) && (
                <Button variant="outline" onClick={() => {
                  clearSearch();
                  clearFilter();
                  setSearchQuery('');
                }}>
                  Clear
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <div className="flex space-x-2">
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateRangeChange(e.target.value, dateRange.end)}
                    />
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateRangeChange(dateRange.start, e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select onValueChange={(value: string) => 
                    updateFilter({ categories: value ? [value as AuditCategory] : undefined })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {Object.values(AuditCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Severity</label>
                  <Select onValueChange={(value: string) => 
                    updateFilter({ severities: value ? [value as AuditSeverity] : undefined })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="All severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All severities</SelectItem>
                      {Object.values(AuditSeverity).map((severity) => (
                        <SelectItem key={severity} value={severity}>
                          {severity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Success</label>
                  <Select onValueChange={(value: string) => 
                    updateFilter({ success: value === '' ? undefined : value === 'true' })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="All results" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All results</SelectItem>
                      <SelectItem value="true">Success only</SelectItem>
                      <SelectItem value="false">Failures only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              {totalCount} entries found
              {searchResults && ` (filtered from ${auditLogs?.totalCount || 0} total)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load audit logs. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Loading audit logs...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : displayLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayLogs.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(entry.timestamp), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(entry.timestamp), 'HH:mm:ss')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {AUDIT_ACTION_DESCRIPTIONS[entry.action] || entry.action}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {entry.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(entry.category)}
                            <span className="text-sm">
                              {entry.category.replace('_', ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{entry.actorName}</div>
                          <div className="text-xs text-muted-foreground">{entry.actorEmail}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {entry.targetName || entry.targetType}
                          </div>
                          {entry.targetId && (
                            <div className="text-xs text-muted-foreground font-mono">
                              {entry.targetId.substring(0, 8)}...
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSeverityBadgeVariant(entry.severity)}>
                            {entry.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getSuccessIcon(entry.success)}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Audit Log Details</DialogTitle>
                                <DialogDescription>
                                  {format(new Date(entry.timestamp), 'PPpp')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-semibold mb-2">Basic Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>Action:</strong> {entry.action}</div>
                                      <div><strong>Category:</strong> {entry.category}</div>
                                      <div><strong>Severity:</strong> {entry.severity}</div>
                                      <div><strong>Success:</strong> {entry.success ? 'Yes' : 'No'}</div>
                                      {entry.duration && (
                                        <div><strong>Duration:</strong> {entry.duration}ms</div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Actor Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>Name:</strong> {entry.actorName}</div>
                                      <div><strong>Email:</strong> {entry.actorEmail}</div>
                                      <div><strong>Role:</strong> {entry.actorRole}</div>
                                      <div><strong>IP Address:</strong> {entry.ipAddress}</div>
                                    </div>
                                  </div>
                                </div>
                                
                                {entry.targetName && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Target Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>Type:</strong> {entry.targetType}</div>
                                      <div><strong>Name:</strong> {entry.targetName}</div>
                                      {entry.targetId && (
                                        <div><strong>ID:</strong> {entry.targetId}</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Description</h4>
                                  <p className="text-sm bg-muted p-3 rounded">{entry.description}</p>
                                </div>
                                
                                {entry.details && Object.keys(entry.details).length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Details</h4>
                                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                                      {JSON.stringify(entry.details, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                
                                {(entry.oldValues || entry.newValues) && (
                                  <div className="grid gap-4 md:grid-cols-2">
                                    {entry.oldValues && (
                                      <div>
                                        <h4 className="font-semibold mb-2">Old Values</h4>
                                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                                          {JSON.stringify(entry.oldValues, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                    {entry.newValues && (
                                      <div>
                                        <h4 className="font-semibold mb-2">New Values</h4>
                                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                                          {JSON.stringify(entry.newValues, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {entry.errorMessage && (
                                  <div>
                                    <h4 className="font-semibold mb-2 text-red-600">Error Message</h4>
                                    <p className="text-sm bg-red-50 border border-red-200 p-3 rounded text-red-800">
                                      {entry.errorMessage}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {auditLogs && auditLogs.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {auditLogs.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(auditLogs.totalPages, prev + 1))}
                    disabled={currentPage === auditLogs.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SuperAdminGuard>
  );
};

export default AuditLogDashboard;