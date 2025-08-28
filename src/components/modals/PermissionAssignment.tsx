import React, { useState } from 'react';
import { X, Shield, Users, Check } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface PermissionAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  roleId?: string;
  roleName?: string;
  currentPermissions?: string[];
  onSave?: (permissions: string[]) => void;
}

export const PermissionAssignment: React.FC<PermissionAssignmentProps> = ({
  isOpen,
  onClose,
  roleId,
  roleName,
  currentPermissions = [],
  onSave
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Mock permissions data
  const allPermissions: Permission[] = [
    { id: '1', name: 'users.manage', description: 'Manage user accounts', category: 'User Management' },
    { id: '2', name: 'users.view', description: 'View user profiles', category: 'User Management' },
    { id: '3', name: 'roles.manage', description: 'Manage system roles', category: 'Role Management' },
    { id: '4', name: 'roles.view', description: 'View system roles', category: 'Role Management' },
    { id: '5', name: 'reports.view', description: 'View reports', category: 'Reports' },
    { id: '6', name: 'reports.export', description: 'Export reports', category: 'Reports' },
    { id: '7', name: 'audit.view', description: 'View audit logs', category: 'Security' },
    { id: '8', name: 'system.admin', description: 'System administration', category: 'System' }
  ];

  const categories = [...new Set(allPermissions.map(p => p.category))];

  const filteredPermissions = allPermissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || permission.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    if (onSave) {
      onSave(selectedPermissions);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Assign Permissions to {roleName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Permission List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <div className="divide-y divide-gray-200">
              {filteredPermissions.map((permission) => (
                <div key={permission.id} className="p-4 hover:bg-gray-50">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{permission.name}</span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {permission.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
                    </div>
                    {selectedPermissions.includes(permission.id) && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Count */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <Users className="h-4 w-4 inline mr-1" />
              {selectedPermissions.length} permissions selected
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
