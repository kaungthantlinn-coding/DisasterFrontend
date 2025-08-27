import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, FileImage } from 'lucide-react';
import { useAuditFilterOptions } from '../../hooks/useAuditLog';

interface ExportField {
  key: string;
  label: string;
  checked: boolean;
}

interface ExportFilters {
  action?: string;
  targetType?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

interface ExportAuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, fields: string[], filters: ExportFilters) => void;
  currentFilters?: ExportFilters;
}

const ExportAuditLogsModal: React.FC<ExportAuditLogsModalProps> = ({
  isOpen,
  onClose,
  onExport,
  currentFilters = {}
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('excel');
  const [exportFields, setExportFields] = useState<ExportField[]>([
    { key: 'UserName', label: 'User Name', checked: true },
    { key: 'Action', label: 'Action', checked: true },
    { key: 'Details', label: 'Description', checked: true },
    { key: 'Resource', label: 'Resource/Target', checked: true },
    { key: 'Timestamp', label: 'Timestamp', checked: true },
    { key: 'IpAddress', label: 'IP Address', checked: false },
    { key: 'UserId', label: 'User ID', checked: false },
    { key: 'UserEmail', label: 'User Email', checked: false },
    { key: 'Severity', label: 'Severity', checked: false },
    { key: 'UserAgent', label: 'User Agent', checked: false },
    { key: 'Metadata', label: 'Metadata', checked: false }
  ]);
  
  const [filters, setFilters] = useState<ExportFilters>(currentFilters);
  const { filterOptions, isLoading: isLoadingOptions } = useAuditFilterOptions();

  const formatOptions = [
    {
      key: 'pdf' as const,
      label: 'PDF',
      description: 'Formatted document',
      icon: FileText,
      color: 'text-red-600'
    },
    {
      key: 'excel' as const,
      label: 'Excel',
      description: 'Spreadsheet format',
      icon: FileSpreadsheet,
      color: 'text-green-600'
    },
    {
      key: 'csv' as const,
      label: 'CSV',
      description: 'Comma separated',
      icon: FileImage,
      color: 'text-blue-600'
    }
  ];

  const handleFieldToggle = (fieldKey: string) => {
    setExportFields(prev =>
      prev.map(field =>
        field.key === fieldKey ? { ...field, checked: !field.checked } : field
      )
    );
  };

  const handleFilterChange = (key: keyof ExportFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleExport = () => {
    const selectedFields = exportFields
      .filter(field => field.checked)
      .map(field => field.key);
    
    onExport(selectedFormat, selectedFields, filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <Download className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-semibold">Export Audit Logs</h2>
              <p className="text-blue-100 text-sm">Download audit log data in your preferred format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Choose Export Format</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {formatOptions.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.key}
                    onClick={() => setSelectedFormat(format.key)}
                    className={`relative p-4 border-2 rounded-lg transition-all ${
                      selectedFormat === format.key
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedFormat === format.key && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`w-8 h-8 ${format.color}`} />
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{format.label}</div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 border border-gray-400 rounded"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Select Fields to Include</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {exportFields.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={field.checked}
                    onChange={() => handleFieldToggle(field.key)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Apply Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Filter
                </label>
                <select
                  value={filters.action || ''}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoadingOptions}
                >
                  <option value="">All Actions</option>
                  {filterOptions?.actions.map((action) => (
                    <option key={action} value={action}>
                      {action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Type Filter
                </label>
                <select
                  value={filters.targetType || ''}
                  onChange={(e) => handleFilterChange('targetType', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoadingOptions}
                >
                  <option value="">All Types</option>
                  {filterOptions?.targetTypes.map((targetType) => (
                    <option key={targetType} value={targetType}>
                      {targetType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exportFields.filter(f => f.checked).length === 0}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportAuditLogsModal;
