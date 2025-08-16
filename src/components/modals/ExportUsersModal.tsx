import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, File, Users, Filter, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { userManagementApi, ExportUsersParams } from '../../apis/userManagement';

interface ExportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalUsers: number;
  availableRoles: string[];
}

const ExportUsersModal: React.FC<ExportUsersModalProps> = ({
  isOpen,
  onClose,
  totalUsers,
  availableRoles
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('excel');
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    lastLogin: false,
    phone: false
  });
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleFieldChange = (field: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const selectedFieldsList = Object.entries(selectedFields)
        .filter(([_, selected]) => selected)
        .map(([field]) => field);

      if (selectedFieldsList.length === 0) {
        toast.error('Please select at least one field to export.');
        setIsExporting(false);
        return;
      }

      const exportParams: ExportUsersParams = {
        format: exportFormat,
        fields: selectedFieldsList,
        filters: {
          role: roleFilter !== 'all' ? roleFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      };

      console.log('Exporting users with:', exportParams);

      const response = await userManagementApi.exportUsers(exportParams);
      const blob = response.data;

      const now = new Date();
      const date = now.toISOString().slice(0, 10);
      const time = now.toISOString().slice(11, 16);
      const fileName = `Disaster Watch – Users Export – ${date} ${time} UTC.${exportFormat}`;

      console.log('Received file:', { fileName, type: blob.type, size: blob.size });

      if (blob.size === 0) {
        toast.error('Export failed: Received an empty file.');
        return;
      }

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success('User data exported successfully!');
      onClose();

    } catch (error: any) {
      console.error('Export failed:', error);
      if (error.response && error.response.data instanceof Blob) {
        const errorBlob = error.response.data;
        const errorText = await errorBlob.text();
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(`Export failed: ${errorJson.message || 'Backend error'}`);
        } catch (e) {
          toast.error(`Export failed: ${errorText || 'An unknown error occurred'}`);
        }
      } else {
        toast.error(`Export failed: ${error.message || 'An unknown error occurred'}`);
        toast.error('Failed to export users. Please try again.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Export Users</h2>
                <p className="text-blue-100 text-sm">Download user data in your preferred format</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-1 min-h-0">
          {/* Export Format Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <File className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Choose Export Format</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`group relative p-6 border-2 rounded-xl transition-all duration-200 ${
                  exportFormat === 'pdf'
                    ? 'border-red-500 bg-red-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-lg ${exportFormat === 'pdf' ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-red-50'}`}>
                    <FileText className={`w-8 h-8 ${exportFormat === 'pdf' ? 'text-red-600' : 'text-gray-600 group-hover:text-red-500'}`} />
                  </div>
                  <div className="text-center">
                    <span className={`text-lg font-semibold ${exportFormat === 'pdf' ? 'text-red-700' : 'text-gray-700'}`}>PDF</span>
                    <p className="text-xs text-gray-500 mt-1">Formatted document</p>
                  </div>
                </div>
                {exportFormat === 'pdf' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>

              <button
                onClick={() => setExportFormat('excel')}
                className={`group relative p-6 border-2 rounded-xl transition-all duration-200 ${
                  exportFormat === 'excel'
                    ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-lg ${exportFormat === 'excel' ? 'bg-green-100' : 'bg-gray-100 group-hover:bg-green-50'}`}>
                    <FileSpreadsheet className={`w-8 h-8 ${exportFormat === 'excel' ? 'text-green-600' : 'text-gray-600 group-hover:text-green-500'}`} />
                  </div>
                  <div className="text-center">
                    <span className={`text-lg font-semibold ${exportFormat === 'excel' ? 'text-green-700' : 'text-gray-700'}`}>Excel</span>
                    <p className="text-xs text-gray-500 mt-1">Spreadsheet format</p>
                  </div>
                </div>
                {exportFormat === 'excel' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>

              <button
                onClick={() => setExportFormat('csv')}
                className={`group relative p-6 border-2 rounded-xl transition-all duration-200 ${
                  exportFormat === 'csv'
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-lg ${exportFormat === 'csv' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-50'}`}>
                    <FileSpreadsheet className={`w-8 h-8 ${exportFormat === 'csv' ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-500'}`} />
                  </div>
                  <div className="text-center">
                    <span className={`text-lg font-semibold ${exportFormat === 'csv' ? 'text-blue-700' : 'text-gray-700'}`}>CSV</span>
                    <p className="text-xs text-gray-500 mt-1">Comma separated</p>
                  </div>
                </div>
                {exportFormat === 'csv' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Fields Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Select Fields to Include</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedFields).map(([field, selected]) => (
                  <label key={field} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleFieldChange(field)}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Apply Filters</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Role Filter</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Roles</option>
                  {availableRoles.map(role => (
                    <option key={role} value={role} className="capitalize">{role}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Export Summary</h4>
                <p className="text-blue-700">
                  Ready to export <span className="font-bold">{totalUsers} users</span> as <span className="font-bold uppercase">{exportFormat}</span> format
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-3" />
                  Export Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportUsersModal;