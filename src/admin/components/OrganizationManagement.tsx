import React, { useState, useEffect } from 'react';
import { OrganizationService } from '../../services/organizationService';
import type { OrganizationDto, CreateOrganizationDto, UpdateOrganizationDto } from '../../types/Organization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { 
  Building2, 
  Globe, 
  Mail, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Users
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

const OrganizationManagement: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationDto | null>(null);
  const [formData, setFormData] = useState<CreateOrganizationDto | UpdateOrganizationDto>({
    name: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    contactEmail: ''
  });
  const { accessToken } = useAuthStore();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OrganizationService.getAll();
      setOrganizations(data);
    } catch (err) {
      setError('Failed to load organizations. Please try again later.');
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (!accessToken) throw new Error('Authentication required');
      
      await OrganizationService.create(formData as CreateOrganizationDto, accessToken);
      toast.success('Organization created successfully');
      resetForm();
      fetchOrganizations();
    } catch (err) {
      toast.error('Failed to create organization');
      console.error('Error creating organization:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!accessToken || !editingOrg) throw new Error('Authentication required');
      
      await OrganizationService.update(editingOrg.id, formData as UpdateOrganizationDto, accessToken);
      toast.success('Organization updated successfully');
      resetForm();
      fetchOrganizations();
    } catch (err) {
      toast.error('Failed to update organization');
      console.error('Error updating organization:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!accessToken) throw new Error('Authentication required');
      
      await OrganizationService.remove(id, accessToken);
      toast.success('Organization deleted successfully');
      fetchOrganizations();
    } catch (err) {
      toast.error('Failed to delete organization');
      console.error('Error deleting organization:', err);
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingOrg(null);
    setFormData({
      name: '',
      description: '',
      logoUrl: '',
      websiteUrl: '',
      contactEmail: ''
    });
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const startEdit = (org: OrganizationDto) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      description: org.description || '',
      logoUrl: org.logoUrl || '',
      websiteUrl: org.websiteUrl || '',
      contactEmail: org.contactEmail || ''
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleWebsiteClick = (url?: string) => {
    if (url) {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEmailClick = (email?: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <Building2 className="w-6 h-6 text-blue-800 absolute top-3 left-1/2 -translate-x-1/2" />
            </div>
            <p className="text-gray-600 text-lg mt-2">Loading organizations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchOrganizations} className="bg-blue-600 hover:bg-blue-700 px-6 py-2">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
          <p className="text-gray-600 mt-2">Manage partner organizations and their information</p>
        </div>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingOrg) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {isCreating ? (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Organization
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Organization
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isCreating 
                ? 'Add a new organization to the platform' 
                : `Update information for ${editingOrg?.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter organization name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <Input
                  value={formData.logoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <Input
                  value={formData.websiteUrl || ''}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <Input
                  value={formData.contactEmail || ''}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@example.com"
                  type="email"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the organization and its mission"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={isCreating ? handleCreate : handleUpdate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Create Organization' : 'Update Organization'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organizations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card key={org.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {org.logoUrl ? (
                    <img
                      src={org.logoUrl}
                      alt={`${org.name} logo`}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    {org.createdAt && (
                      <p className="text-xs text-gray-500">Added {formatDate(org.createdAt)}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(org)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(org.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {org.description && (
                <CardDescription className="mb-4 line-clamp-3">
                  {org.description}
                </CardDescription>
              )}
              
              <div className="space-y-2">
                {org.websiteUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWebsiteClick(org.websiteUrl)}
                    className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="truncate">Visit Website</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                )}
                
                {org.contactEmail && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEmailClick(org.contactEmail)}
                    className="w-full justify-start text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">Contact</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {organizations.length === 0 && !isCreating && !editingOrg && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No organizations yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding a new organization.</p>
          <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;