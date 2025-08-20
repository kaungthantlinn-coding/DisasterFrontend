import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRoles, useCreateRole } from '@/hooks/useRoleManagement';
import { CreateRoleDto } from '@/apis/roleManagement';
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Search, 
  Crown,
  UserCheck,
  Clock,
  Settings,
  Eye,
  Copy,
  Download,
  Upload
} from 'lucide-react';

const RoleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    category: 'operational' as 'system' | 'emergency' | 'operational' | 'public'
  });

  // API calls
  const filters = useMemo(() => ({
    search: searchTerm || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    filter: selectedFilter !== 'all' ? selectedFilter : undefined,
  }), [searchTerm, selectedCategory, selectedFilter]);

  const { data: rolesData, isLoading, error } = useRoles(filters);
  const createRoleMutation = useCreateRole();

  const roles = rolesData?.roles || [];
  const statistics = rolesData?.statistics;


  const getCategoryBadge = (category: string) => {
    const colors = {
      system: 'bg-purple-100 text-purple-800',
      emergency: 'bg-red-100 text-red-800',
      operational: 'bg-blue-100 text-blue-800',
      public: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[category as keyof typeof colors]}>{category.toUpperCase()}</Badge>;
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim() || !newRole.description.trim()) {
      return;
    }

    const createDto: CreateRoleDto = {
      name: newRole.name,
      description: newRole.description,
      category: newRole.category
    };

    try {
      await createRoleMutation.mutateAsync(createDto);
      
      // Reset form and close modal
      setNewRole({
        name: '',
        description: '',
        category: 'operational'
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const getRoleIcon = (roleName: string) => {
    const name = roleName.toLowerCase();
    if (name === 'superadmin') return <Crown className="w-6 h-6 text-purple-600" />;
    if (name === 'admin') return <Settings className="w-6 h-6 text-blue-600" />;
    if (name === 'cj') return <Shield className="w-6 h-6 text-red-600" />;
    if (name === 'user') return <Users className="w-6 h-6 text-green-600" />;
    return <UserCheck className="w-6 h-6 text-gray-600" />;
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
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
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
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newRole.category}
                    onChange={(e) => setNewRole({ ...newRole, category: e.target.value as any })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="operational">Operational</option>
                    <option value="emergency">Emergency</option>
                    <option value="public">Public</option>
                    <option value="system">System</option>
                  </select>
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics?.totalRoles || 0}</p>
                  <p className="text-xs text-green-600 mt-1">System managed</p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics?.systemRoles || 0}</p>
                  <p className="text-xs text-purple-600 mt-1">Administrative</p>
                </div>
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emergency Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics?.emergencyRoles || 0}</p>
                  <p className="text-xs text-red-600 mt-1">Criminal Justice</p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Operational Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics?.operationalRoles || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Administration</p>
                </div>
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics?.totalUsers?.toLocaleString() || 0}</p>
                  <p className="text-xs text-green-600 mt-1">Across all roles</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search roles by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="system">System Roles</option>
              <option value="custom">Custom Roles</option>
              <option value="active">Active Roles</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="emergency">Emergency</option>
              <option value="operational">Operational</option>
              <option value="public">Public</option>
              <option value="system">System</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Failed to load roles</p>
              <p className="text-sm text-gray-500 mt-1">Please try refreshing the page</p>
            </div>
          </CardContent>
        </Card>
      ) : roles.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No roles found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getRoleIcon(role.name)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      {role.isSystem && <Badge variant="secondary">System</Badge>}
                      {getCategoryBadge(role.category)}
                    </div>
                    <p className="text-gray-600 mb-3">{role.description}</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{role.userCount.toLocaleString()} users</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Modified {new Date(role.lastModified).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        Users
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-1" />
                        Clone
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleManagement;