import React, { useState, useEffect } from 'react';
import { X, Shield, Save, Loader2 } from 'lucide-react';
import { Role } from '../../types/roles';
import { roleManagementService } from '../../apis/roleManagement';

interface RoleEditModalProps {
  role: Role | null;
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
}

export const RoleEditModal: React.FC<RoleEditModalProps> = ({ 
  role, 
  isOpen, 
  isCreating, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (role && !isCreating) {
      setFormData({
        name: role.name,
        description: role.description,
        isActive: role.isActive
      });
    } else if (isCreating) {
      setFormData({
        name: '',
        description: '',
        isActive: true
      });
    }
  }, [role, isCreating]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      if (isCreating) {
        // Create new role
        const newRole = await roleManagementService.createRole({
          name: formData.name.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive
        });
        onSave(newRole);
      } else if (role) {
        // Update existing role
        const updatedRole = await roleManagementService.updateRole(role.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          isActive: formData.isActive
        });
        onSave(updatedRole);
      }
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save role' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isCreating ? 'Create New Role' : 'Edit Role'}
              </h2>
              <p className="text-sm text-gray-500">
                {isCreating ? 'Create a new role with custom permissions' : 'Modify role details and permissions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter role name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe the role and its purpose"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only"
                  />
                  <div 
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                  <div 
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.isActive ? 'transform translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  formData.isActive ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};