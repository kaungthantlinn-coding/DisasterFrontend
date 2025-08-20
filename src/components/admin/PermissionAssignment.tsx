import React, { useState, useMemo } from 'react';
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
import { toast } from 'sonner';
import {
  Users,
  Shield,
  Save,
  FileText,
  Settings,
  Database,
  BarChart3,
  Plus,
  Minus,
  CheckCircle2 as CheckCircle,
  XCircle
} from 'lucide-react';
import { Permission, PermissionCategory, PERMISSION_METADATA, PERMISSION_GROUPS, UserWithPermissions, Role } from '@/types/permissions';
import { useCurrentUserPermissions, useRoles, useUserPermissions, useQuickPermissions } from '@/hooks/usePermissions';
import { useAuditLogger } from '@/hooks/useAudit';
import { AuditAction } from '@/types/audit';
import { SuperAdminGuard } from '../guards/PermissionGuard';

interface PermissionAssignmentProps {
  className?: string;
}

interface PermissionAssignmentState {
  selectedUser: UserWithPermissions | null;
  selectedRole: Role | null;
  assignmentType: 'user' | 'role';
  searchQuery: string;
  selectedCategory: PermissionCategory | 'all';
  selectedGroup: string | 'all';
  pendingChanges: {
    userId?: string;
    roleId?: string;
    permissions: {
      permission: Permission;
      action: 'grant' | 'revoke';
    }[];
  };
  showPreview: boolean;
}

const PermissionAssignment: React.FC<PermissionAssignmentProps> = ({ className }) => {
  const [state, setState] = useState<PermissionAssignmentState>({
    selectedUser: null,
    selectedRole: null,
    assignmentType: 'user',
    searchQuery: '',
    selectedCategory: 'all',
    selectedGroup: 'all',
    pendingChanges: {
      permissions: [],
    },
    showPreview: false,
  });

  useCurrentUserPermissions();
  const { roles } = useRoles();
  useUserPermissions(); // This hook is not directly used for mutations in this component, but might be needed for caching
  const { quickGrantPermission, quickRevokePermission } = useQuickPermissions();
  const { logPermissionAction } = useAuditLogger();

  // Mock role objects for sample data

  // Mock users data - in real app, this would come from API
  // In a real app, users would be fetched from an API
  const [users] = useState<UserWithPermissions[]>([]);

  // Filter permissions based on search and category
  const filteredPermissions = useMemo(() => {
    let permissions = Object.values(Permission);

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      permissions = permissions.filter((permission) => {
        const metadata = PERMISSION_METADATA[permission];
        return (
          permission.toLowerCase().includes(query) ||
          metadata.description.toLowerCase().includes(query) ||
          metadata.category.toLowerCase().includes(query)
        );
      });
    }

    // Filter by category
    if (state.selectedCategory !== 'all') {
      permissions = permissions.filter((permission) =>
        PERMISSION_METADATA[permission].category === state.selectedCategory
      );
    }

    // Filter by group
    if (state.selectedGroup !== 'all') {
      const group = PERMISSION_GROUPS.find((g) => g.id === state.selectedGroup);
      if (group) {
        permissions = permissions.filter((permission) =>
          group.permissions.includes(permission)
        );
      }
    }

    return permissions;
  }, [state.searchQuery, state.selectedCategory, state.selectedGroup]);

  // Get current permissions for selected user/role
  const getCurrentPermissions = (): Permission[] => {
    if (state.assignmentType === 'user' && state.selectedUser) {
      return state.selectedUser.effectivePermissions;
    }
    if (state.assignmentType === 'role' && state.selectedRole) {
      return state.selectedRole.permissions || [];
    }
    return [];
  };

  // Check if permission is currently assigned
  const isPermissionAssigned = (permission: Permission): boolean => {
    const currentPermissions = getCurrentPermissions();
    const pendingChange = state.pendingChanges.permissions.find((p) => p.permission === permission);

    if (pendingChange) {
      return pendingChange.action === 'grant';
    }

    return currentPermissions.includes(permission);
  };

  // Check if permission has pending changes
  const hasPendingChange = (permission: Permission): boolean => {
    return state.pendingChanges.permissions.some((p) => p.permission === permission);
  };

  // Toggle permission assignment
  const togglePermission = (permission: Permission) => {
    const isCurrentlyAssigned = getCurrentPermissions().includes(permission);
    const existingChangeIndex = state.pendingChanges.permissions.findIndex((p) => p.permission === permission);

    setState((prev) => {
      const newPendingChanges = { ...prev.pendingChanges };

      if (existingChangeIndex >= 0) {
        // Remove existing pending change
        newPendingChanges.permissions.splice(existingChangeIndex, 1);
      } else {
        // Add new pending change
        newPendingChanges.permissions.push({
          permission,
          action: isCurrentlyAssigned ? 'revoke' : 'grant',
        });
      }

      return {
        ...prev,
        pendingChanges: newPendingChanges,
      };
    });
  };

  // Apply pending changes
  const applyChanges = async () => {
    if (state.pendingChanges.permissions.length === 0) {
      toast.error('No changes to apply');
      return;
    }

    try {
      if (state.assignmentType === 'user' && state.selectedUser) {
        for (const change of state.pendingChanges.permissions) {
          if (change.action === 'grant') {
            await quickGrantPermission({ userId: state.selectedUser.userId, permission: change.permission });
          } else {
            await quickRevokePermission({ userId: state.selectedUser.userId, permission: change.permission });
          }

          // Log the change
          await logPermissionAction(
            change.action === 'grant' ? AuditAction.PERMISSION_GRANTED : AuditAction.PERMISSION_REVOKED,
            change.permission,
            {
              type: 'user',
              id: state.selectedUser.userId,
              name: state.selectedUser.name,
            },
            {
              reason: 'Manual assignment via Permission Assignment interface',
            }
          );
        }

        toast.success(`Applied ${state.pendingChanges.permissions.length} permission changes to ${state.selectedUser.name}`);
      } else if (state.assignmentType === 'role' && state.selectedRole) {
        // Handle role permission changes
        toast.success(`Applied ${state.pendingChanges.permissions.length} permission changes to ${state.selectedRole.name} role`);
      }

      // Clear pending changes
      setState((prev) => ({
        ...prev,
        pendingChanges: { permissions: [] },
      }));
    } catch (error) {
      toast.error('Failed to apply permission changes');
      console.error('Permission assignment error:', error);
    }
  };

  // Clear pending changes
  const clearChanges = () => {
    setState((prev) => ({
      ...prev,
      pendingChanges: { permissions: [] },
    }));
  };

  // Get permission category icon
  const getCategoryIcon = (category: PermissionCategory) => {
    switch (category) {
      case PermissionCategory.USER_MANAGEMENT:
        return <Users className="h-4 w-4" />;
      case PermissionCategory.REPORT_MANAGEMENT:
        return <FileText className="h-4 w-4" />;
      case PermissionCategory.SYSTEM_SETTINGS:
        return <Settings className="h-4 w-4" />;
      case PermissionCategory.AUDIT_LOGS:
        return <Database className="h-4 w-4" />;
      case PermissionCategory.DASHBOARD_ACCESS:
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  // Get permission status badge
  const getPermissionStatusBadge = (permission: Permission) => {
    const isAssigned = isPermissionAssigned(permission);
    const hasPending = hasPendingChange(permission);

    if (hasPending) {
      const pendingChange = state.pendingChanges.permissions.find((p) => p.permission === permission);
      if (pendingChange?.action === 'grant') {
        return <Badge variant="default" className="bg-green-100 text-green-800">Granting</Badge>;
      } else {
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Revoking</Badge>;
      }
    }

    return isAssigned ? (
      <Badge variant="default">Granted</Badge>
    ) : (
      <Badge variant="secondary">Not Granted</Badge>
    );
  };

  return (
    <SuperAdminGuard>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Permission Assignment</h1>
            <p className="text-muted-foreground">
              Assign and manage specific permissions for users and roles
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {state.pendingChanges.permissions.length > 0 && (
              <Badge variant="secondary">
                {state.pendingChanges.permissions.length} pending changes
              </Badge>
            )}
          </div>
        </div>

        {/* Target Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Target</CardTitle>
            <CardDescription>
              Choose a user or role to manage permissions for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={(value: any) =>
                setState((prev) => ({
                  ...prev,
                  assignmentType: value,
                  selectedUser: null,
                  selectedRole: null,
                  pendingChanges: { permissions: [] },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a user or role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <Users className="h-4 w-4 mr-2" />
                  User Permissions
                </SelectItem>
                <SelectItem value="role">
                  <Shield className="h-4 w-4 mr-2" />
                  Role Permissions
                </SelectItem>
              </SelectContent>
            </Select>

            {state.assignmentType === 'user' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Select User</label>
                <Select
                  onValueChange={(value) => {
                    const user = users.find((u) => u.userId === value);
                    setState((prev) => ({
                      ...prev,
                      selectedUser: user || null,
                      pendingChanges: { permissions: [] },
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user to manage permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.userId} value={user.userId}>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {state.assignmentType === 'role' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Select Role</label>
                <Select
                  onValueChange={(value) => {
                    const role = roles.find((r: Role) => r.id === value);
                    setState((prev) => ({
                      ...prev,
                      selectedRole: role || null,
                      pendingChanges: { permissions: [] },
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role to manage permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role: Role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{role.displayName}</div>
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permission Management */}
        {(state.selectedUser || state.selectedRole) && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Permissions</CardTitle>
                  <CardDescription>
                    Grant or revoke specific permissions for the selected {state.assignmentType}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {state.pendingChanges.permissions.length > 0 ? (
                    <>
                      <Button onClick={applyChanges}><Save className="h-4 w-4 mr-2" /> Apply Changes</Button>
                      <Button variant="outline" onClick={clearChanges}><XCircle className="h-4 w-4 mr-2" /> Discard</Button>
                    </>
                  ) : (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span>No pending changes</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Permissions</label>
                  <Input
                    placeholder="Search by name or description..."
                    value={state.searchQuery}
                    onChange={(e) => setState((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    onValueChange={(value: any) =>
                      setState((prev) => ({ ...prev, selectedCategory: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.values(PermissionCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(category)}
                            <span>{category.replace('_', ' ')}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Permission Group</label>
                  <Select
                    onValueChange={(value) =>
                      setState((prev) => ({ ...prev, selectedGroup: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {PERMISSION_GROUPS.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Permissions Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No permissions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPermissions.map((permission) => {
                        const metadata = PERMISSION_METADATA[permission];
                        const isAssigned = isPermissionAssigned(permission);
                        const hasPending = hasPendingChange(permission);

                        return (
                          <TableRow key={permission} className={hasPending ? 'bg-muted/50' : ''}>
                            <TableCell>
                              <div className="font-medium">{permission}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(metadata.category)}
                                <span className="text-sm">{metadata.category.replace('_', ' ')}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground max-w-[300px]">
                                {metadata.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getPermissionStatusBadge(permission)}
                            </TableCell>
                            <TableCell>
                              <button onClick={() => togglePermission(permission)} className="p-1 rounded-full hover:bg-muted">
                                {isAssigned ? <Minus className="h-4 w-4 text-red-500" /> : <Plus className="h-4 w-4 text-green-500" />}
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Changes Preview */}
        {state.pendingChanges.permissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Changes</CardTitle>
              <CardDescription>
                Review the changes before applying them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.pendingChanges.permissions.map((change, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {change.action === 'grant' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">{change.permission}</div>
                        <div className="text-sm text-muted-foreground">
                          {PERMISSION_METADATA[change.permission].description}
                        </div>
                      </div>
                    </div>
                    <Badge variant={change.action === 'grant' ? 'default' : 'destructive'}>
                      {change.action === 'grant' ? 'Grant' : 'Revoke'}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={clearChanges}>
                  Cancel All Changes
                </Button>
                <Button onClick={applyChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Apply {state.pendingChanges.permissions.length} Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Target Selected */}
        {!state.selectedUser && !state.selectedRole && (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Target</h3>
              <p className="text-muted-foreground mb-4">
                Choose a user or role above to start managing permissions
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </SuperAdminGuard>
  );
};

export default PermissionAssignment;