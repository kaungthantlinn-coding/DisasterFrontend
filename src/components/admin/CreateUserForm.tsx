import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  AlertTriangle,
  Search
} from 'lucide-react';
import {
  Permission,
  PermissionCategory,
  PERMISSION_METADATA,
  Role,
} from '@/types/permissions';
import { useRoles, useCurrentUserPermissions } from '@/hooks/usePermissions';
import { PermissionUtils } from '@/utils/permissionUtils';
import { userManagementApi } from '@/services/userManagement';
import { toast } from 'sonner';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  roleIds: z.array(z.string()).min(1, 'At least one role must be selected'),
  directPermissions: z.array(z.string()).default([]),
  sendWelcomeEmail: z.boolean().default(true),
  requirePasswordChange: z.boolean().default(true),
  notes: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

interface PermissionGroupProps {
  title: string;
  permissions: Permission[];
  selectedPermissions: Permission[];
  onPermissionChange: (permission: Permission, checked: boolean) => void;
  disabled?: boolean;
  userCanAssign: (permission: Permission) => boolean;
}

const PermissionGroup: React.FC<PermissionGroupProps> = ({
  title,
  permissions,
  selectedPermissions,
  onPermissionChange,
  disabled = false,
  userCanAssign
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedCount = permissions.filter(p => selectedPermissions.includes(p)).length;
  
  return (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <CardDescription className="text-xs">
              {selectedCount} of {permissions.length} permissions selected
            </CardDescription>
          </div>
          <Badge variant={selectedCount > 0 ? "default" : "secondary"}>
            {selectedCount}/{permissions.length}
          </Badge>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-2">
            {permissions.map((permission) => {
              const metadata = PERMISSION_METADATA[permission as Permission];
              const canAssign = userCanAssign(permission);
              const isSelected = selectedPermissions.includes(permission);
              
              return (
                <div key={permission} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={permission}
                    checked={isSelected}
                    onCheckedChange={(checked: boolean) => onPermissionChange(permission, !!checked)}
                    disabled={disabled || !canAssign}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={permission} 
                      className={`text-sm font-medium cursor-pointer ${
                        !canAssign ? 'text-gray-400' : ''
                      }`}
                    >
                      {metadata?.name || permission}
                      {metadata?.isSystemCritical && (
                        <AlertTriangle className="inline-block w-3 h-3 ml-1 text-amber-500" />
                      )}
                    </Label>
                    <p className={`text-xs mt-1 ${
                      !canAssign ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {metadata?.description || 'No description available'}
                    </p>
                    {!canAssign && (
                      <p className="text-xs text-red-500 mt-1">
                        You don't have permission to assign this
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('basic');
  
  const { roles } = useRoles();
  const { hasPermission, user: currentUser } = useCurrentUserPermissions();
  
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      roleIds: [],
      directPermissions: [],
      sendWelcomeEmail: true,
      requirePasswordChange: true,
      notes: ''
    }
  });
  
  const watchedRoleIds = watch('roleIds');
  const watchedDirectPermissions = watch('directPermissions');
  
  // Calculate effective permissions from selected roles
  const effectivePermissions = React.useMemo(() => {
    const selectedRoles = roles?.filter((role: Role) => watchedRoleIds.includes(role.id)) || [];
    const rolePermissions = selectedRoles.reduce((acc: Permission[], role: Role) => {
      return [...acc, ...role.permissions];
    }, [] as Permission[]);
    
    const directPerms = watchedDirectPermissions as Permission[];
    return [...new Set([...rolePermissions, ...directPerms])];
  }, [roles, watchedRoleIds, watchedDirectPermissions]);
  
  // Check if current user can assign a permission
  const canAssignPermission = React.useCallback((permission: Permission) => {
    if (!currentUser) return false;
    const userWithPermissions = PermissionUtils.convertToUserWithPermissions(currentUser);
    return PermissionUtils.hasPermission(userWithPermissions, permission) || 
           PermissionUtils.isSuperAdmin(userWithPermissions);
  }, [currentUser]);
  
  // Filter permissions based on search
  const filteredPermissions = React.useMemo(() => {
    if (!searchTerm) return Object.values(Permission);
    
    return Object.values(Permission).filter(permission => {
      const metadata = PERMISSION_METADATA[permission];
      const searchLower = searchTerm.toLowerCase();
      return (
        permission.toLowerCase().includes(searchLower) ||
        metadata?.name.toLowerCase().includes(searchLower) ||
        metadata?.description.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm]);
  
  // Group permissions by category
  const groupedPermissions = React.useMemo(() => {
    const grouped: Record<PermissionCategory, Permission[]> = {} as any;
    
    Object.values(PermissionCategory).forEach(category => {
      grouped[category] = filteredPermissions.filter(
        permission => PERMISSION_METADATA[permission]?.category === category
      );
    });
    
    return grouped;
  }, [filteredPermissions]);
  
  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    const currentPermissions = watchedDirectPermissions as Permission[];
    if (checked) {
      setValue('directPermissions', [...currentPermissions, permission]);
    } else {
      setValue('directPermissions', currentPermissions.filter(p => p !== permission));
    }
  };
  
  const handleRoleChange = (roleId: string, checked: boolean) => {
    const currentRoles = watchedRoleIds;
    if (checked) {
      setValue('roleIds', [...currentRoles, roleId]);
    } else {
      setValue('roleIds', currentRoles.filter(id => id !== roleId));
    }
  };
  
  const onSubmit = async (data: CreateUserFormData) => {
    if (!hasPermission(Permission.CREATE_USER)) {
      toast.error('You do not have permission to create users');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const createUserData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        roleIds: data.roleIds,
        directPermissions: data.directPermissions,
        sendWelcomeEmail: data.sendWelcomeEmail,
        requirePasswordChange: data.requirePasswordChange,
        notes: data.notes
      };
      
      const newUser = await userManagementApi.createUser(createUserData);
      
      toast.success('User created successfully');
      onSuccess?.(newUser);
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    reset();
    setSearchTerm('');
    setSelectedTab('basic');
    onClose();
  };
  
  const hasSystemCriticalPermissions = effectivePermissions.some(
    permission => PERMISSION_METADATA[permission as Permission]?.isSystemCritical
  );
  
  const selectedRoles = roles.filter(role => watchedRoleIds.includes(role.id));
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Create New User
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="review">Review & Create</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          id="name"
                          placeholder="Enter full name"
                          className="pl-10"
                        />
                      </div>
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          className="pl-10"
                        />
                      </div>
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          id="phone"
                          placeholder="Enter phone number"
                          className="pl-10"
                        />
                      </div>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          className="pl-10"
                        />
                      </div>
                    )}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        className="pl-10"
                      />
                    </div>
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Controller
                  name="sendWelcomeEmail"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendWelcomeEmail"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="sendWelcomeEmail" className="text-sm">
                        Send welcome email to user
                      </Label>
                    </div>
                  )}
                />
                
                <Controller
                  name="requirePasswordChange"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requirePasswordChange"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="requirePasswordChange" className="text-sm">
                        Require password change on first login
                      </Label>
                    </div>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="notes"
                      placeholder="Add any additional notes about this user..."
                      rows={3}
                    />
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="roles" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">Assign Roles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roles?.map((role: Role) => {
                      const isSelected = watchedRoleIds.includes(role.id);
                      const isSystemRole = role.isSystemRole;
                      
                      return (
                        <Card key={role.id} className={`cursor-pointer transition-colors ${
                          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                id={`role-${role.id}`}
                                checked={isSelected}
                                onCheckedChange={(checked: boolean) => handleRoleChange(role.id, !!checked)}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Label 
                                    htmlFor={`role-${role.id}`} 
                                    className="font-medium cursor-pointer"
                                  >
                                    {role.displayName}
                                  </Label>
                                  {isSystemRole && (
                                    <Badge variant="secondary" className="text-xs">
                                      System
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {role.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {role.permissions.length} permissions
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  {errors.roleIds && (
                    <p className="text-sm text-red-500 mt-2">{errors.roleIds.message}</p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Additional Permissions</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(groupedPermissions).map(([category, permissions]) => {
                      if (permissions.length === 0) return null;
                      
                      return (
                        <PermissionGroup
                          key={category}
                          title={category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          permissions={permissions}
                          selectedPermissions={watchedDirectPermissions as Permission[]}
                          onPermissionChange={handlePermissionChange}
                          userCanAssign={canAssignPermission}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="review" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">User Information</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Name</Label>
                          <p className="text-sm">{watch('name') || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Email</Label>
                          <p className="text-sm">{watch('email') || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Phone</Label>
                          <p className="text-sm">{watch('phone') || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Settings</Label>
                          <div className="text-sm space-y-1">
                            {watch('sendWelcomeEmail') && <p>• Welcome email will be sent</p>}
                            {watch('requirePasswordChange') && <p>• Password change required on first login</p>}
                          </div>
                        </div>
                      </div>
                      {watch('notes') && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium text-gray-500">Notes</Label>
                          <p className="text-sm mt-1">{watch('notes')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Assigned Roles</h3>
                  <Card>
                    <CardContent className="p-4">
                      {selectedRoles.length > 0 ? (
                        <div className="space-y-2">
                          {selectedRoles.map((role) => (
                            <div key={role.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium">{role.displayName}</p>
                                <p className="text-sm text-gray-600">{role.description}</p>
                              </div>
                              <Badge variant={role.isSystemRole ? "default" : "secondary"}>
                                {role.permissions.length} permissions
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No roles assigned</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Effective Permissions</h3>
                  <Card>
                    <CardContent className="p-4">
                      {effectivePermissions.length > 0 ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-3">
                            This user will have {effectivePermissions.length} total permissions
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {effectivePermissions.slice(0, 10).map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {PERMISSION_METADATA[permission as Permission]?.name || permission}
                              </Badge>
                            ))}
                            {effectivePermissions.length > 10 && (
                              <Badge variant="secondary" className="text-xs">
                                +{effectivePermissions.length - 10} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No permissions assigned</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {hasSystemCriticalPermissions && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This user will have system-critical permissions. Please ensure this is intended.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {selectedTab !== 'basic' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ['basic', 'roles', 'review'];
                    const currentIndex = tabs.indexOf(selectedTab);
                    if (currentIndex > 0) {
                      setSelectedTab(tabs[currentIndex - 1]);
                    }
                  }}
                >
                  Previous
                </Button>
              )}
              {selectedTab !== 'review' ? (
                <Button
                  type="button"
                  onClick={() => {
                    const tabs = ['basic', 'roles', 'review'];
                    const currentIndex = tabs.indexOf(selectedTab);
                    if (currentIndex < tabs.length - 1) {
                      setSelectedTab(tabs[currentIndex + 1]);
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;