

import { useEffect, useState } from "react";
import { OrganizationService } from "../../services/organizationService";
import { OrganizationDto, CreateOrganizationDto, UpdateOrganizationDto } from "../../types/Organization";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<OrganizationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrg, setEditingOrg] = useState<OrganizationDto | null>(null);
  const [newOrg, setNewOrg] = useState<CreateOrganizationDto>({ name: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const token = useAuthStore((state) => state.accessToken);

  // Fetch organizations
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const data = await OrganizationService.getAll();
      setOrganizations(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Create new org
  const handleCreate = async () => {
    if (!newOrg.name.trim()) return toast.error("Name is required");
    try {
      await OrganizationService.create(newOrg, token);
      toast.success("Organization created!");
      setNewOrg({ name: "" });
      setShowCreateForm(false);
      fetchOrganizations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create organization");
    }
  };

  // Update org
  const handleUpdate = async () => {
    if (!editingOrg) return;
    try {
      const dto: UpdateOrganizationDto = {
        name: editingOrg.name,
        description: editingOrg.description,
        logoUrl: editingOrg.logoUrl,
        websiteUrl: editingOrg.websiteUrl,
        contactEmail: editingOrg.contactEmail,
      };
      await OrganizationService.update(editingOrg.id, dto, token);
      toast.success("Organization updated!");
      setEditingOrg(null);
      fetchOrganizations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update organization");
    }
  };

  // Delete org
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    try {
      await OrganizationService.remove(id, token);
      toast.success("Organization deleted!");
      fetchOrganizations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete organization");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Organization Management</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Organization
        </button>
      </div>

      {/* Create new organization card */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
              <input
                type="text"
                placeholder="Enter organization name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="contact@example.com"
                value={newOrg.contactEmail || ""}
                onChange={(e) => setNewOrg({ ...newOrg, contactEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={newOrg.websiteUrl || ""}
                onChange={(e) => setNewOrg({ ...newOrg, websiteUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={newOrg.logoUrl || ""}
                onChange={(e) => setNewOrg({ ...newOrg, logoUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Organization description"
                value={newOrg.description || ""}
                onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreate} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Create Organization
            </button>
          </div>
        </div>
      )}

      {/* Organizations list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : organizations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No organizations</h3>
          <p className="mt-1 text-gray-500">Get started by creating a new organization.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Organization
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div key={org.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {org.logoUrl ? (
                      <img src={org.logoUrl} alt={org.name} className="h-10 w-10 rounded-md object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9" />
                        </svg>
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
                      {org.contactEmail && (
                        <p className="text-sm text-gray-500">{org.contactEmail}</p>
                      )}
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ID: {org.id}
                  </span>
                </div>
                
                {org.description && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{org.description}</p>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {org.websiteUrl && (
                    <a 
                      href={org.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Website
                    </a>
                  )}
                </div>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                {editingOrg?.id === org.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingOrg(null)}
                      className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingOrg(org)}
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Organization</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editingOrg.name}
                    onChange={(e) => setEditingOrg({ ...editingOrg, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingOrg.description || ""}
                    onChange={(e) => setEditingOrg({ ...editingOrg, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={editingOrg.contactEmail || ""}
                    onChange={(e) => setEditingOrg({ ...editingOrg, contactEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={editingOrg.websiteUrl || ""}
                    onChange={(e) => setEditingOrg({ ...editingOrg, websiteUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={editingOrg.logoUrl || ""}
                    onChange={(e) => setEditingOrg({ ...editingOrg, logoUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setEditingOrg(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
