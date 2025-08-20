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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  Users,
  Settings,
  Save,
  AlertTriangle,
  FileText,
  CheckCircle,
} from 'lucide-react';
import {
  Permission,
  PermissionCategory,
  Role,
  PERMISSION_METADATA,
  SYSTEM_ROLES
} from '../../types/permissions';
import { AuditAction, AuditCategory } from '../../types/audit';
import {
  useCurrentUserPermissions,
  useRoles
} from '../../hooks/usePermissions';
import { useAuditLogger } from '../../hooks/useAudit';
import { SuperAdminGuard } from '../guards/PermissionGuard';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface RoleManagementProps {
  className?: string;
}

interface RoleFormData {
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
}

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name must be less than 50 characters'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  permissions: z.array(z.nativeEnum(Permission)).min(1, 'At least one permission is required'),
  isActive: z.boolean()
});

const RoleManagement: React.FC<RoleManagementProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PermissionCategory | 'all'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissionSearchQuery, setPermissionSearchQuery] = useState('');

  const { hasPermission } = useCurrentUserPermissions();
  const { sortedRoles, createRole, updateRole, deleteRole } = useRoles();
  const { logAction } = useAuditLogger();

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
      isActive: true
    }
  });

  const watchedPermissions = watch('permissions');

  // Combine system and custom roles
  const allRoles = useMemo(() => {
    const systemRoles = Object.values(SYSTEM_ROLES) as unknown as Role[];
    const roles = sortedRoles ? [...systemRoles, ...sortedRoles] : systemRoles;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return roles.filter(role => 
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
      );
    }
    
    return roles;
  }, [sortedRoles, searchQuery]);

  // Filter permissions for the permission selector
  const filteredPermissions = useMemo(() => {
    let permissions = Object.values(Permission);

    // Filter by search query
    if (permissionSearchQuery) {
      const query = permissionSearchQuery.toLowerCase();
      permissions = permissions.filter(permission => {
        const metadata = PERMISSION_METADATA[permission];
        return (
          permission.toLowerCase().includes(query) ||
          metadata.description.toLowerCase().includes(query) ||
          metadata.category.toLowerCase().includes(query)
        );
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      permissions = permissions.filter(permission => 
        PERMISSION_METADATA[permission].category === selectedCategory
      );
    }

    return permissions;
  }, [permissionSearchQuery, selectedCategory]);

  // Group permissions by category for better organization
  const groupedPermissions = useMemo(() => {
    const groups = Object.values(PermissionCategory).reduce((acc, category) => {
      acc[category] = [];
      return acc;
    }, {} as Record<PermissionCategory, Permission[]>);

    for (const permission of filteredPermissions) {
      const metadata = PERMISSION_METADATA[permission];
      if (metadata && metadata.category && groups[metadata.category]) {
        groups[metadata.category].push(permission);
      }
    }

    return groups;
  }, [filteredPermissions]);

  // Handle role creation
  const handleCreateRole = async (data: RoleFormData) => {
    try {
      const roleData = { ...data, displayName: data.name };
      await createRole(roleData);

      logAction(
        AuditAction.ROLE_CREATED,
        AuditCategory.ROLE_MANAGEMENT,
        `Created role: ${data.name}`,
        { targetName: data.name, details: { roleName: data.name } }
      );

      toast.success(`Role "${data.name}" created successfully`);
      setShowCreateDialog(false);
      reset();
    } catch (error) {
      toast.error('Failed to create role');
      console.error('Role creation error:', error);
    }
  };

  // Handle role update
  const handleUpdateRole = async (data: RoleFormData) => {
    if (!selectedRole) return;

    try {
      await updateRole({ roleId: selectedRole.id, data });

      logAction(
        AuditAction.ROLE_UPDATED,
        AuditCategory.ROLE_MANAGEMENT,
        `Updated role: ${data.name}`,
        { targetId: selectedRole.id, targetName: data.name, details: { roleId: selectedRole.id, roleName: data.name } }
      );

      toast.success(`Role "${data.name}" updated successfully`);
      setShowEditDialog(false);
      setSelectedRole(null);
      reset();
    } catch (error) {
      toast.error('Failed to update role');
      console.error('Role update error:', error);
    }
  };

  // Handle role deletion
  const handleDeleteRole = async () => {
    if (!selectedRole || selectedRole.isSystemRole) return;

    try {
      await deleteRole({ roleId: selectedRole.id });

      logAction(
        AuditAction.ROLE_DELETED,
        AuditCategory.ROLE_MANAGEMENT,
        `Deleted role: ${selectedRole.name}`,
        { targetId: selectedRole.id, targetName: selectedRole.name, details: { roleId: selectedRole.id, roleName: selectedRole.name } }
      );

      toast.success(`Role "${selectedRole.name}" deleted successfully`);
      setShowDeleteDialog(false);
      setSelectedRole(null);
    } catch (error) {
      toast.error('Failed to delete role');
      console.error('Role deletion error:', error);
    }
  };

  // Handle role duplication
  const handleDuplicateRole = async (data: RoleFormData) => {
    if (!selectedRole) return;

    try {
      const roleData = {
        name: data.name,
        displayName: data.name,
        description: data.description,
        permissions: selectedRole.permissions,
        isActive: data.isActive,
      };
      await createRole(roleData);

      await logAction(
        AuditAction.ROLE_DUPLICATED,
        AuditCategory.ROLE_MANAGEMENT,
        `Duplicated role: ${data.name} from ${selectedRole.name}`,
        { targetName: data.name, details: { newRoleName: data.name, originalRoleId: selectedRole.id } }
      );

      toast.success(`Role "${data.name}" created as copy of "${selectedRole.name}"`);
      setShowDuplicateDialog(false);
      setSelectedRole(null);
      reset();
    } catch (error) {
      toast.error('Failed to duplicate role');
      console.error('Role duplication error:', error);
    }
  };

  // Open edit dialog with role data
  const openEditDialog = (role: Role) => {
    if (role.isSystemRole) {
      toast.error('System roles cannot be edited');
      return;
    }
    
    setSelectedRole(role);
    setValue('name', role.name);
    setValue('description', role.description);
    setValue('permissions', role.permissions);
    setValue('isActive', role.isActive);
    setShowEditDialog(true);
  };

  // Open duplicate dialog with role data
  const openDuplicateDialog = (role: Role) => {
    setSelectedRole(role);
    setValue('name', `${role.name} (Copy)`);
    setValue('description', `Copy of ${role.description}`);
    setValue('permissions', role.permissions);
    setValue('isActive', true);
    setShowDuplicateDialog(true);
  };

  // Open delete dialog
  const openDeleteDialog = (role: Role) => {
    if (role.isSystemRole) {
      toast.error('System roles cannot be deleted');
      return;
    }
    
    setSelectedRole(role);
    setShowDeleteDialog(true);
  };

  // Toggle permission selection
  const togglePermission = (permission: Permission) => {
    const currentPermissions = watchedPermissions || [];
    const isSelected = currentPermissions.includes(permission);
    
    if (isSelected) {
      setValue('permissions', currentPermissions.filter(p => p !== permission));
    } else {
      setValue('permissions', [...currentPermissions, permission]);
    }
  };

  // Select all permissions in a category
  const selectCategoryPermissions = (category: PermissionCategory) => {
    const categoryPermissions = groupedPermissions[category];
    const currentPermissions = watchedPermissions || [];
    const newPermissions = [...new Set([...currentPermissions, ...categoryPermissions])];
    setValue('permissions', newPermissions);
  };

  // Deselect all permissions in a category
  const deselectCategoryPermissions = (category: PermissionCategory) => {
    const categoryPermissions = groupedPermissions[category];
    const currentPermissions = watchedPermissions || [];
    const newPermissions = currentPermissions.filter(p => !categoryPermissions.includes(p));
    setValue('permissions', newPermissions);
  };

  // Get category icon
  const getCategoryIcon = (category: PermissionCategory) => {
    switch (category) {
      case PermissionCategory.USER_MANAGEMENT:
        return <Users className="h-4 w-4" />;
      case PermissionCategory.REPORT_MANAGEMENT:
        return <FileText className="h-4 w-4" />;
      case PermissionCategory.SYSTEM_SETTINGS:
        return <Settings className="h-4 w-4" />;
      // Add other cases as per your actual PermissionCategory enum
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  // Reset form and close dialogs
  const closeDialogs = () => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setShowDeleteDialog(false);
    setShowDuplicateDialog(false);
    setSelectedRole(null);
    reset();
  };

  return (
    <SuperAdminGuard>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage custom roles with specific permission sets
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} disabled={!hasPermission(Permission.CREATE_ROLE)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Filter roles..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>
              Manage system and custom roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No roles found
                      </TableCell>
                    </TableRow>
                  ) : (
                    allRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{role.name}</div>
                            <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                              {role.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={role.isSystemRole ? 'secondary' : 'default'}>
                            {role.isSystemRole ? 'System' : 'Custom'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {role.permissions.length} permissions
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={role.isActive ? 'default' : 'secondary'}>
                            {role.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openDuplicateDialog(role)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {!role.isSystemRole && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => openEditDialog(role)}
                                    disabled={!hasPermission(Permission.EDIT_ROLE)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => openDeleteDialog(role)}
                                    disabled={!hasPermission(Permission.DELETE_ROLE)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Role Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(handleCreateRole)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Role Name</label>
                  <Input
                    {...register('name')}
                    placeholder="Enter role name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    {...register('isActive')}
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active Role
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  {...register('description')}
                  placeholder="Describe the role's purpose and responsibilities"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-4 block">Permissions</label>
                
                {/* Permission Search */}
                <div className="mb-4">
                  <Input
                    placeholder="Search permissions..."
                    value={permissionSearchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPermissionSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Permission Categories */}
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => {
                    if (permissions.length === 0) return null;
                    
                    const selectedCount = permissions.filter(p => watchedPermissions?.includes(p)).length;
                    const allSelected = selectedCount === permissions.length;
                    
                    return (
                      <Card key={category}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(category as PermissionCategory)}
                              <CardTitle className="text-base">
                                {category.replace('_', ' ')}
                              </CardTitle>
                              <Badge variant="outline">
                                {selectedCount}/{permissions.length}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => selectCategoryPermissions(category as PermissionCategory)}
                                disabled={allSelected}
                              >
                                Select All
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => deselectCategoryPermissions(category as PermissionCategory)}
                                disabled={selectedCount === 0}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-3 md:grid-cols-2">
                            {permissions.map((permission) => {
                              const isSelected = watchedPermissions?.includes(permission) || false;
                              const metadata = PERMISSION_METADATA[permission];
                              
                              return (
                                <div key={permission} className="flex items-start space-x-3">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => togglePermission(permission)}
                                    id={permission}
                                  />
                                  <div className="flex-1">
                                    <label
                                      htmlFor={permission}
                                      className="text-sm font-medium cursor-pointer"
                                    >
                                      {permission}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                      {metadata.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {errors.permissions && (
                  <p className="text-sm text-destructive mt-2">{errors.permissions.message}</p>
                )}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialogs}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Modify the role's permissions and settings
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(handleUpdateRole)} className="space-y-6">
              {/* Same form content as create dialog */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Role Name</label>
                  <Input
                    {...register('name')}
                    placeholder="Enter role name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    {...register('isActive')}
                    id="editIsActive"
                  />
                  <label htmlFor="editIsActive" className="text-sm font-medium">
                    Active Role
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  {...register('description')}
                  placeholder="Describe the role's purpose and responsibilities"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-4 block">Permissions</label>
                
                {/* Permission Search */}
                <div className="mb-4">
                  <Input
                    placeholder="Search permissions..."
                    value={permissionSearchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPermissionSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Permission Categories - Same as create dialog */}
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => {
                    if (permissions.length === 0) return null;
                    
                    const selectedCount = permissions.filter(p => watchedPermissions?.includes(p)).length;
                    const allSelected = selectedCount === permissions.length;
                    
                    return (
                      <Card key={category}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(category as PermissionCategory)}
                              <CardTitle className="text-base">
                                {category.replace('_', ' ')}
                              </CardTitle>
                              <Badge variant="outline">
                                {selectedCount}/{permissions.length}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => selectCategoryPermissions(category as PermissionCategory)}
                                disabled={allSelected}
                              >
                                Select All
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => deselectCategoryPermissions(category as PermissionCategory)}
                                disabled={selectedCount === 0}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-3 md:grid-cols-2">
                            {permissions.map((permission) => {
                              const isSelected = watchedPermissions?.includes(permission) || false;
                              const metadata = PERMISSION_METADATA[permission];
                              
                              return (
                                <div key={permission} className="flex items-start space-x-3">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => togglePermission(permission)}
                                    id={`edit-${permission}`}
                                  />
                                  <div className="flex-1">
                                    <label
                                      htmlFor={`edit-${permission}`}
                                      className="text-sm font-medium cursor-pointer"
                                    >
                                      {permission}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                      {metadata.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {errors.permissions && (
                  <p className="text-sm text-destructive mt-2">{errors.permissions.message}</p>
                )}
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialogs}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Update Role
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Duplicate Role Dialog */}
        <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Duplicate Role</DialogTitle>
              <DialogDescription>
                Create a copy of "{selectedRole?.name}" with the same permissions
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(handleDuplicateRole)} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">New Role Name</label>
                <Input
                  {...register('name')}
                  placeholder="Enter new role name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  {...register('description')}
                  placeholder="Describe the new role"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...register('isActive')}
                  id="duplicateIsActive"
                />
                <label htmlFor="duplicateIsActive" className="text-sm font-medium">
                  Active Role
                </label>
              </div>
              
              {selectedRole && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    This role will be created with {selectedRole.permissions.length} permissions from "{selectedRole.name}"
                  </AlertDescription>
                </Alert>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialogs}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Role
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Role Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Role</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the role "{selectedRole?.name}"?
              </DialogDescription>
            </DialogHeader>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. Users with this role will lose their associated permissions.
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button variant="outline" onClick={closeDialogs}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteRole}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminGuard>
  );
};

export default RoleManagement;