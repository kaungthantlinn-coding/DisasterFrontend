import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Loader2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import Avatar from '../Common/Avatar';
import { useRoleUpdate } from '../../hooks/useRoleUpdate';
import { RoleUpdateValidationDto } from '../../apis/userManagement';
import { showSuccessToast } from '../../utils/notifications';

// Helper function to convert role names to proper case for API
const convertToProperCase = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'Admin';
    case 'cj':
      return 'CJ';
    case 'user':
      return 'User';
    default:
      return role;
  }
};

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'cj' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  location?: string;
  reportsCount: number;
  lastActive: string;
  photoUrl?: string;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, userData: any) => Promise<void>;
  availableRoles: string[];
  isLoading?: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  roleNames: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  roleNames?: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSave, 
  availableRoles
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    roleNames: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [roleValidation, setRoleValidation] = useState<RoleUpdateValidationDto | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [originalRoles, setOriginalRoles] = useState<string[]>([]);

  // Initialize role update hook
  const { validateAndUpdateRoles, isLoading: isRoleUpdateLoading } = useRoleUpdate();

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      // Convert user role to proper case for API consistency
      const userRole = user.role;
      const properCaseRole = convertToProperCase(userRole);
      const userRoles = [properCaseRole];

      // Debug: Log role initialization data
      console.log('EditUserModal - Role Initialization:', {
        userRole,
        properCaseRole,
        userRoles,
        availableRoles,
        dropdownValue: properCaseRole?.toLowerCase()
      });

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        roleNames: userRoles
      });
      setOriginalRoles(userRoles);
      setErrors({});
      setRoleValidation(null);
      setShowConfirmation(false);
    }
  }, [user, availableRoles]);

  if (!isOpen || !user) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Role validation
    if (formData.roleNames.length === 0) {
      newErrors.roleNames = 'At least one role must be selected';
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
      // Check if roles have changed
      const rolesChanged = JSON.stringify(formData.roleNames.sort()) !== JSON.stringify(originalRoles.sort());

      // Debug: Log role change detection
      console.log('EditUserModal - Role Change Detection:', {
        formDataRoles: formData.roleNames,
        originalRoles,
        rolesChanged,
        formDataSorted: JSON.stringify(formData.roleNames.sort()),
        originalSorted: JSON.stringify(originalRoles.sort())
      });

      if (rolesChanged) {
        // Handle role-specific update with validation
        await handleRoleUpdate();
      } else {
        // Handle regular user update (no role changes) - use existing API
        // Ensure role names are in proper case even for non-role updates
        const properCaseRoles = formData.roleNames.map(convertToProperCase);



        const updateData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phone.trim() || null,
          photoUrl: user.photoUrl || null,
          roles: properCaseRoles.map(role => role.toLowerCase()),
          isBlacklisted: user.status === 'suspended' || false
        };
        
        await onSave(user.id, updateData);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      // Error handling is done in the parent component via toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleUpdate = async () => {
    try {
      // Ensure role names are in proper case for API
      const properCaseRoles = formData.roleNames.map(convertToProperCase);



      // Prepare other user data that might have changed
      const otherUserData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim() || null,
                  photoUrl: user.photoUrl || null,
        isBlacklisted: user.status === 'suspended' || false
      };

      await validateAndUpdateRoles(
        user.id,
        {
          roleNames: properCaseRoles,
          reason: 'Role updated via admin panel'
        },
        otherUserData
      );

      showSuccessToast('User role updated successfully');
      onClose();
    } catch (error: any) {
      if (error.requiresConfirmation && error.validation) {
        // Show confirmation dialog for role changes that require confirmation
        setRoleValidation(error.validation);
        setShowConfirmation(true);
      } else if (error.validation && !error.validation.canUpdate) {
        // Show validation errors as form errors
        setErrors(prev => ({
          ...prev,
          roleNames: error.validation.blockers.join(', ')
        }));
      } else {
        // Re-throw other errors to be handled by parent component
        throw error;
      }
    }
  };

  const handleConfirmRoleUpdate = async () => {
    setShowConfirmation(false);
    setIsSaving(true);

    try {
      // Ensure role names are in proper case for API
      const properCaseRoles = formData.roleNames.map(convertToProperCase);



      // Prepare other user data that might have changed
      const otherUserData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim() || null,
                  photoUrl: user.photoUrl || null,
        isBlacklisted: user.status === 'suspended' || false
      };

      // Proceed with role update, skipping validation since we already confirmed
      await validateAndUpdateRoles(
        user.id,
        {
          roleNames: properCaseRoles,
          reason: 'Role updated via admin panel (confirmed)'
        },
        otherUserData,
        true // Skip validation
      );

      showSuccessToast('User role updated successfully');
      onClose();
    } catch (error) {
      console.error('Failed to update user roles:', error);
      // Error handling is done in the parent component via toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setRoleValidation(null);
  };

  const handleRemoveRole = (roleToRemove: string) => {
    // Prevent removing the last role
    if (formData.roleNames.length <= 1) {
      console.log('Cannot remove last role');
      return;
    }

    const updatedRoles = formData.roleNames.filter(
      role => role.toLowerCase() !== roleToRemove.toLowerCase()
    );

    console.log('EditUserModal - Remove Role:', {
      removedRole: roleToRemove,
      previousRoles: formData.roleNames,
      updatedRoles
    });

    setFormData(prev => ({
      ...prev,
      roleNames: updatedRoles
    }));

    // Clear any previous validation when roles change
    setRoleValidation(null);
    setShowConfirmation(false);
  };

  const handleRoleChange = (role: string) => {
    // Convert lowercase role back to proper case for API
    const properCaseRole = convertToProperCase(role);

    // Debug: Log role change details
    console.log('EditUserModal - Role Change:', {
      selectedRole: role,
      properCaseRole,
      previousRoles: formData.roleNames,
      originalRoles,
      availableRoles
    });

    // Add new role while keeping existing roles (avoid duplicates)
    const existingRoles = formData.roleNames;
    const newRoles = [...existingRoles];
    
    // Add the new role if it's not already present
    if (!newRoles.some(r => r.toLowerCase() === properCaseRole.toLowerCase())) {
      newRoles.push(properCaseRole);
    }

    console.log('EditUserModal - Updated Roles:', {
      existingRoles,
      newRole: properCaseRole,
      finalRoles: newRoles
    });

    setFormData(prev => ({
      ...prev,
      roleNames: newRoles
    }));
    
    // Clear any previous validation when role changes
    setRoleValidation(null);
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar
              src={user.photoUrl}
              alt={user.name}
              name={formData.name || user.name}
              size="xl"
              className="shadow-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Editing: {user.name}</h3>
              <p className="text-sm text-gray-600">User ID: {user.id}</p>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
              disabled={isSaving || isRoleUpdateLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
              disabled={isSaving || isRoleUpdateLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter phone number (optional)"
              disabled={isSaving || isRoleUpdateLoading}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4 inline mr-2" />
              Roles *
            </label>
            
            {/* Current Roles Display */}
            {formData.roleNames.length > 0 && (
              <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current roles:</p>
                <div className="flex flex-wrap gap-1">
                  {formData.roleNames.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {convertToProperCase(role)}
                      {formData.roleNames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(role)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          disabled={isSaving || isRoleUpdateLoading}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <select
              id="role"
              value=""
              onChange={(e) => e.target.value && handleRoleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.roleNames ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSaving || isRoleUpdateLoading}
            >
              <option value="">Add a role...</option>
              {availableRoles
                .filter(role => !formData.roleNames.some(r => r.toLowerCase() === role.toLowerCase()))
                .map(role => (
                  <option key={role} value={role.toLowerCase()}>
                    {convertToProperCase(role)}
                  </option>
                ))}
            </select>
            {errors.roleNames && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.roleNames}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isRoleUpdateLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isRoleUpdateLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {(isSaving || isRoleUpdateLoading) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Role Update Confirmation Dialog */}
      {showConfirmation && roleValidation && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Role Changes</h3>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-3">
                You are about to change the user's role. Please review the following:
              </p>

              {roleValidation.warnings.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-yellow-700 mb-2">Warnings:</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-600 space-y-1">
                    {roleValidation.warnings.map((warning: string, index: number) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {roleValidation.affectedPermissions.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-blue-700 mb-2">Affected Permissions:</h4>
                  <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                    {roleValidation.affectedPermissions.map((permission: string, index: number) => (
                      <li key={index}>{permission}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelConfirmation}
                disabled={isSaving}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleUpdate}
                disabled={isSaving}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Confirm Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserModal;
