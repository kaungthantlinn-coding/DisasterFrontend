import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks/useRoleManagement';
import { CreateRoleDto, UpdateRoleDto, Role } from '@/types/roles';
import { 
  Shield, 
  Users, 
  Plus, 
  Edit,
  Trash2,
  Search, 
  Crown,
  UserCheck,
  Clock,
  Settings,
  Eye,
  CheckCircle,
} from 'lucide-react';

const RoleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: ''
  });
  const [editRole, setEditRole] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // API calls
  const filters = useMemo(() => ({
    search: searchTerm || undefined,
    filter: selectedFilter !== 'all' ? selectedFilter : undefined,
  }), [searchTerm, selectedFilter]);

  const { data: rolesData, isLoading, error } = useRoles(filters);
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const roles = rolesData?.roles || [];
  const statistics = rolesData?.statistics;


  const getStatusBadge = (isActive: boolean, isSystem: boolean) => {
    if (isSystem) {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg px-3 py-1 text-xs font-bold uppercase tracking-wide">
          <Crown className="w-3 h-3 mr-1" />
          SYSTEM
        </Badge>
      );
    }
    return isActive ? 
      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-3 py-1 text-xs font-bold uppercase tracking-wide">
        <CheckCircle className="w-3 h-3 mr-1" />
        ACTIVE
      </Badge> : 
      <Badge className="bg-gradient-to-r from-gray-400 to-gray-600 text-white border-0 shadow-lg px-3 py-1 text-xs font-bold uppercase tracking-wide">
        <Clock className="w-3 h-3 mr-1" />
        INACTIVE
      </Badge>;
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim() || !newRole.description.trim()) {
      return;
    }

    const createDto: CreateRoleDto = {
      name: newRole.name,
      description: newRole.description
    };

    try {
      await createRoleMutation.mutateAsync(createDto);
      
      // Reset form and close modal
      setNewRole({
        name: '',
        description: ''
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole || !editRole.name.trim() || !editRole.description.trim()) {
      return;
    }

    const updateDto: UpdateRoleDto = {
      name: editRole.name,
      description: editRole.description,
      isActive: editRole.isActive
    };

    try {
      await updateRoleMutation.mutateAsync({ roleId: selectedRole.id, data: updateDto });
      
      // Reset form and close modal
      setEditRole({
        name: '',
        description: '',
        isActive: true
      });
      setSelectedRole(null);
      setIsEditModalOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      await deleteRoleMutation.mutateAsync({ roleId: selectedRole.id });
      
      // Reset and close modal
      setSelectedRole(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const openEditModal = (role: Role) => {
    if (role.isSystem) {
      return; // Don't allow editing system roles
    }
    setSelectedRole(role);
    setEditRole({
      name: role.name,
      description: role.description,
      isActive: role.isActive
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (role: Role) => {
    if (role.isSystem) {
      return; // Don't allow deleting system roles
    }
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name === 'superadmin') return <Crown className="w-6 h-6 text-white" />;
    if (name === 'admin') return <Settings className="w-6 h-6 text-white" />;
    if (name === 'cj') return <Shield className="w-6 h-6 text-white" />;
    if (name === 'user') return <Users className="w-6 h-6 text-white" />;
    return <UserCheck className="w-6 h-6 text-white" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive role-based access control for emergency management operations</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Create a new role with specific permissions and access levels for your disaster management system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter role name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter role description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  />
                </div>

              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateRole} 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={createRoleMutation.isPending}
                >
                  {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Failed to load role statistics</p>
              <p className="text-sm text-gray-500 mt-1">Please try refreshing the page</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Total Roles</p>
                  <p className="text-3xl font-bold text-purple-900 mb-1">{statistics?.totalRoles || 0}</p>
                  <p className="text-xs text-purple-600 font-medium">System managed</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 via-white to-green-50 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Active Roles</p>
                  <p className="text-3xl font-bold text-green-900 mb-1">{statistics?.activeRoles || 0}</p>
                  <p className="text-xs text-green-600 font-medium">Currently enabled</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">System Roles</p>
                  <p className="text-3xl font-bold text-amber-900 mb-1">{statistics?.systemRoles || 0}</p>
                  <p className="text-xs text-amber-600 font-medium">Built-in roles</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Custom Roles</p>
                  <p className="text-3xl font-bold text-blue-900 mb-1">{statistics?.customRoles || 0}</p>
                  <p className="text-xs text-blue-600 font-medium">User created</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-emerald-900 mb-1">{statistics?.totalUsers?.toLocaleString() || 0}</p>
                  <p className="text-xs text-emerald-600 font-medium">Across all roles</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="border-0 bg-gradient-to-r from-white via-gray-50 to-white shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search roles by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-base"
                />
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full lg:w-auto px-6 py-3 h-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white text-gray-700 font-medium min-w-[180px]"
              >
                <option value="all">All Roles</option>
                <option value="active">Active Roles</option>
                <option value="system">System Roles</option>
                <option value="custom">Custom Roles</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
              <CardContent className="p-0">
                {/* Header skeleton */}
                <div className="p-6 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/30 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-white/40 rounded mb-2"></div>
                      <div className="h-4 bg-white/30 rounded w-20"></div>
                    </div>
                  </div>
                </div>
                
                {/* Content skeleton */}
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  
                  {/* Stats skeleton */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Buttons skeleton */}
                  <div className="flex space-x-2">
                    <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-red-50 via-white to-red-50 shadow-xl border border-red-100">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">Failed to load roles</h3>
              <p className="text-red-700 mb-6">There was an issue loading the role data. Please try again.</p>
              <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg">
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : roles.length === 0 ? (
        <Card className="rounded-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-white shadow-xl">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No roles found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters to find the roles you're looking for</p>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create New Role
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Card key={role.id} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Header with gradient background */}
                <div className={`p-6 ${
                  role.name.toLowerCase() === 'superadmin' 
                    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700' 
                    : role.name.toLowerCase() === 'admin'
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-700'
                    : role.name.toLowerCase() === 'cj'
                    ? 'bg-gradient-to-r from-red-600 via-red-700 to-pink-700'
                    : role.name.toLowerCase() === 'user'
                    ? 'bg-gradient-to-r from-green-600 via-green-700 to-emerald-700'
                    : 'bg-gradient-to-r from-gray-600 via-gray-700 to-slate-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        {getRoleIcon(role.name)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{role.name}</h3>
                        {getStatusBadge(role.isActive, role.isSystem)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-6">
                  <p className="text-gray-700 mb-6 text-sm leading-relaxed">{role.description}</p>
                  
                  {/* Stats section with modern cards */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Users</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{role.userCount.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Updated</span>
                      </div>
                      <p className="text-sm font-semibold text-green-900">{new Date(role.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 min-w-0 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 min-w-0 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Users ({role.userCount})
                    </Button>
                    
                    {!role.isSystem && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditModal(role)}
                          className="flex-1 min-w-0 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all duration-200"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDeleteModal(role)}
                          className="flex-1 min-w-0 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {role.isSystem && (
                    <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-xs text-purple-700 font-medium flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        System role - Cannot be modified or deleted
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Role Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role details and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter role name"
                value={editRole.name}
                onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter role description"
                value={editRole.description}
                onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={editRole.isActive}
                onChange={(e) => setEditRole({ ...editRole, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="edit-active">Active Role</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditRole} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Role Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Warning
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Users assigned to this role will lose their permissions. Make sure to reassign users to other roles before deleting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteRole} 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteRoleMutation.isPending}
            >
              {deleteRoleMutation.isPending ? 'Deleting...' : 'Delete Role'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;