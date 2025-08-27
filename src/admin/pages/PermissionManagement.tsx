import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Key,
  Shield,
  Users,
  Settings,
  FileText,
  Database,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isSystem: boolean;
  assignedRoles: string[];
}

interface PermissionCategory {
  name: string;
  icon: React.ReactNode;
  permissions: Permission[];
}

const PermissionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock permissions data
  const permissions: Permission[] = [
    // User Management
    { id: '1', name: 'user.create', description: 'Create new users', category: 'User Management', isSystem: true, assignedRoles: ['Super Admin', 'Admin'] },
    { id: '2', name: 'user.read', description: 'View user information', category: 'User Management', isSystem: true, assignedRoles: ['Super Admin', 'Admin', 'Moderator'] },
    { id: '3', name: 'user.update', description: 'Update user information', category: 'User Management', isSystem: true, assignedRoles: ['Super Admin', 'Admin'] },
    { id: '4', name: 'user.delete', description: 'Delete users', category: 'User Management', isSystem: true, assignedRoles: ['Super Admin'] },
    
    // Content Management
    { id: '5', name: 'content.create', description: 'Create content', category: 'Content Management', isSystem: true, assignedRoles: ['Super Admin', 'Admin', 'User'] },
    { id: '6', name: 'content.read', description: 'View content', category: 'Content Management', isSystem: true, assignedRoles: ['Super Admin', 'Admin', 'Moderator', 'User'] },
    { id: '7', name: 'content.update', description: 'Update content', category: 'Content Management', isSystem: true, assignedRoles: ['Super Admin', 'Admin', 'Moderator'] },
    { id: '8', name: 'content.delete', description: 'Delete content', category: 'Content Management', isSystem: true, assignedRoles: ['Super Admin', 'Admin'] },
    
    // System Settings
    { id: '9', name: 'system.settings', description: 'Manage system settings', category: 'System', isSystem: true, assignedRoles: ['Super Admin'] },
    { id: '10', name: 'system.backup', description: 'Create system backups', category: 'System', isSystem: true, assignedRoles: ['Super Admin'] },
    { id: '11', name: 'system.logs', description: 'View system logs', category: 'System', isSystem: true, assignedRoles: ['Super Admin', 'Admin'] },
    
    // Reports
    { id: '12', name: 'reports.create', description: 'Create reports', category: 'Reports', isSystem: true, assignedRoles: ['Super Admin', 'Admin', 'User'] },
    { id: '13', name: 'reports.read', description: 'View reports', category: 'Reports', isSystem: true, assignedRoles: ['Super Admin', 'Admin', 'Moderator', 'User'] },
    { id: '14', name: 'reports.manage', description: 'Manage all reports', category: 'Reports', isSystem: true, assignedRoles: ['Super Admin', 'Admin'] },
  ];

  const categories: PermissionCategory[] = [
    {
      name: 'User Management',
      icon: <Users className="w-5 h-5" />,
      permissions: permissions.filter(p => p.category === 'User Management')
    },
    {
      name: 'Content Management',
      icon: <FileText className="w-5 h-5" />,
      permissions: permissions.filter(p => p.category === 'Content Management')
    },
    {
      name: 'System',
      icon: <Settings className="w-5 h-5" />,
      permissions: permissions.filter(p => p.category === 'System')
    },
    {
      name: 'Reports',
      icon: <Database className="w-5 h-5" />,
      permissions: permissions.filter(p => p.category === 'Reports')
    }
  ];

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.name === selectedCategory);

  const searchFilteredCategories = filteredCategories.map(category => ({
    ...category,
    permissions: category.permissions.filter(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.permissions.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
          <p className="text-gray-600 mt-1">Manage system permissions and access control</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Permission
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Permissions</p>
                <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
              </div>
              <Key className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Filter className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Permissions</p>
                <p className="text-2xl font-bold text-gray-900">{permissions.filter(p => p.isSystem).length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custom Permissions</p>
                <p className="text-2xl font-bold text-gray-900">{permissions.filter(p => !p.isSystem).length}</p>
              </div>
              <Edit className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Permissions by Category */}
      <div className="space-y-6">
        {searchFilteredCategories.map((category) => (
          <Card key={category.name}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {category.icon}
                <span>{category.name}</span>
                <Badge variant="secondary">{category.permissions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Checkbox />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{permission.name}</h4>
                          {permission.isSystem && (
                            <Badge variant="secondary">System</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">Assigned to:</span>
                          {permission.assignedRoles.map((role, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {!permission.isSystem && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PermissionManagement;