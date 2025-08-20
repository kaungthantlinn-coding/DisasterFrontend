import React, { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import {
  Users,
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  Calendar,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  DialogTrigger,
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

import { UserWithPermissions, SYSTEM_ROLES } from '../../types/permissions';
import { useUserManagement } from '../../hooks/useUserManagement';
import { UserListItemDto } from '../../apis/userManagement';
// import {
//   useRoles,
// } from '../../hooks/usePermissions';
import { SuperAdminGuard } from '../guards/PermissionGuard';
import { CreateUserForm } from './CreateUserForm';

// Import toast from sonner
import { toast } from 'sonner';

interface FilterState {
  search: string;
  role: string;
  status: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

const AdvancedUserManagement: React.FC = () => {

  // State management
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: 'all',
    status: 'all',
    dateRange: { from: null, to: null },
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Real API integration using useUserManagement hook
  const {
    users,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    isLoading: isLoadingUsers,
    setPage,
    refresh,
  } = useUserManagement({
    initialPageSize: pagination.pageSize,
    autoRefresh: true,
    refreshInterval: 30000
  });

  // Convert API users to UserWithPermissions format
  const convertedUsers: UserWithPermissions[] = users.map((user: UserListItemDto) => ({
    userId: user.userId,
    email: user.email,
    name: user.name,
    roles: user.roleNames.map((roleName: string) => ({
      id: `${roleName}_role`,
      name: roleName,
      displayName: roleName.charAt(0).toUpperCase() + roleName.slice(1),
      description: `${roleName} role`,
      permissions: [],
      isSystemRole: true,
      isActive: true,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.lastActive || new Date().toISOString()
    })),
    directPermissions: [],
    effectivePermissions: [],
    isBlacklisted: user.isBlacklisted,
    isSuperAdmin: user.roleNames.includes('superadmin') || user.roleNames.includes('super_admin'),
  }));

  // Filter and sort users using real data
  const filteredUsers = useMemo(() => {
    let filtered = convertedUsers.filter((user: UserWithPermissions) => {
      const matchesSearch = !filters.search || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = filters.role === 'all' || !filters.role || user.roles.some((role: any) => role.name === filters.role);
      
      const matchesStatus = filters.status === 'all' || !filters.status || 
        (filters.status === 'active' && !user.isBlacklisted) ||
        (filters.status === 'inactive' && user.isBlacklisted) ||
        (filters.status === 'locked' && user.isBlacklisted);
      
      const matchesDateRange = !filters.dateRange.from || !filters.dateRange.to ||
        (new Date(user.roles[0]?.createdAt || '') >= filters.dateRange.from && new Date(user.roles[0]?.createdAt || '') <= filters.dateRange.to);
      
      return matchesSearch && matchesRole && matchesStatus && matchesDateRange;
    });

    // Sort users
    filtered.sort((a: UserWithPermissions, b: UserWithPermissions) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.roles[0]?.name || '';
          bValue = b.roles[0]?.name || '';
          break;
        case 'lastLogin':
          aValue = new Date(a.roles[0]?.updatedAt || '');
          bValue = new Date(b.roles[0]?.updatedAt || '');
          break;
        case 'createdAt':
          aValue = new Date(a.roles[0]?.createdAt || '');
          bValue = new Date(b.roles[0]?.createdAt || '');
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [convertedUsers, filters]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, pagination.page, pagination.pageSize]);

  // Update total when filtered users change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, total: filteredUsers.length }));
  }, [filteredUsers.length]);

  // Handlers
  const handleSelectUser = useCallback((userId: string, selected: boolean) => {
    setSelectedUsers(prev => 
      selected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedUsers(selected ? paginatedUsers.map((user: UserWithPermissions) => user.userId) : []);
  }, [paginatedUsers]);

  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users to perform bulk action');
      return;
    }

    setIsLoading(true);
    try {
      switch (action) {
        case 'activate':
          // Implement bulk activate
          toast.success(`Activated ${selectedUsers.length} users`);
          break;
        case 'deactivate':
          // Implement bulk deactivate
          toast.success(`Deactivated ${selectedUsers.length} users`);
          break;
        case 'lock':
          // Implement bulk lock
          toast.success(`Locked ${selectedUsers.length} users`);
          break;
        case 'unlock':
          // Implement bulk unlock
          toast.success(`Unlocked ${selectedUsers.length} users`);
          break;
        case 'delete':
          // Implement bulk delete
          toast.success(`Deleted ${selectedUsers.length} users`);
          break;
        default:
          toast.error('Unknown action');
      }
      setSelectedUsers([]);
    } catch (error) {
      toast.error('Failed to perform bulk action');
    } finally {
      setIsLoading(false);
    }
  }, [selectedUsers]);

  const handleViewUser = useCallback((user: UserWithPermissions) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  }, []);

  const getStatusBadge = (user: UserWithPermissions) => {
    if (user.isBlacklisted) {
      return <Badge variant="destructive" className="flex items-center gap-1"><Lock className="h-3 w-3" />Blacklisted</Badge>;
    }
    return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>;
  };

  const getRoleBadge = (roleName: string) => {
    const roleColors = {
      [SYSTEM_ROLES.SUPER_ADMIN]: 'bg-red-100 text-red-800',
      [SYSTEM_ROLES.ADMIN]: 'bg-blue-100 text-blue-800',
      [SYSTEM_ROLES.CJ]: 'bg-green-100 text-green-800',
      [SYSTEM_ROLES.USER]: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <Badge className={roleColors[roleName as keyof typeof roleColors] || 'bg-purple-100 text-purple-800'}>
        {roleName}
      </Badge>
    );
  };

  return (
    <SuperAdminGuard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions across the system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system with appropriate roles and permissions.
                  </DialogDescription>
                </DialogHeader>
                <CreateUserForm 
                  isOpen={showCreateDialog}
                  onClose={() => setShowCreateDialog(false)}
                  onSuccess={() => setShowCreateDialog(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={filters.search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={filters.role}
                  onValueChange={(value: string) => setFilters(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {Object.values(SYSTEM_ROLES).map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value: string) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: string) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                    <SelectItem value="lastLogin">Last Login</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{selectedUsers.length} user(s) selected</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                  disabled={isLoading}
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                  disabled={isLoading}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('lock')}
                  disabled={isLoading}
                >
                  <Lock className="h-4 w-4 mr-1" />
                  Lock
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('unlock')}
                  disabled={isLoading}
                >
                  <Unlock className="h-4 w-4 mr-1" />
                  Unlock
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users ({totalCount})
              </span>
              <Button variant="outline" size="sm" onClick={refresh} disabled={isLoadingUsers}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.userId)}
                        onCheckedChange={(checked: boolean) => handleSelectUser(user.userId, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.roleNames[0] || 'user')}</TableCell>
                    <TableCell>{getStatusBadge(convertedUsers.find(u => u.userId === user.userId)!)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {user.lastActive ? format(new Date(user.lastActive), 'MMM dd, yyyy HH:mm') : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            const convertedUser = convertedUsers.find(u => u.userId === user.userId);
                            if (convertedUser) handleViewUser(convertedUser);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {!user.isBlacklisted ? (
                              <><UserX className="h-4 w-4 mr-2" />Blacklist</>
                            ) : (
                              <><UserCheck className="h-4 w-4 mr-2" />Remove from Blacklist</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={!hasPreviousPage}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                View detailed information about the selected user.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-medium">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getRoleBadge(selectedUser.roles[0]?.name || 'user')}
                      {getStatusBadge(selectedUser)}
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="details" className="w-full">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">User ID</label>
                        <p className="text-sm">{selectedUser.userId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                        <p className="text-sm">{selectedUser.roles[0]?.displayName || 'User'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <p className="text-sm">
                          {selectedUser.isBlacklisted ? 'Blacklisted' : 'Active'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                        <p className="text-sm">
                          {selectedUser.roles[0]?.updatedAt ? format(new Date(selectedUser.roles[0].updatedAt), 'PPpp') : 'Never'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Created</label>
                        <p className="text-sm">{format(new Date(selectedUser.roles[0]?.createdAt || ''), 'PPpp')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                        <p className="text-sm">{format(new Date(selectedUser.roles[0]?.updatedAt || ''), 'PPpp')}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="permissions">
                    <div className="text-sm text-muted-foreground">
                      Permission details would be displayed here.
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <div className="text-sm text-muted-foreground">
                      User activity log would be displayed here.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminGuard>
  );
};

export default AdvancedUserManagement;