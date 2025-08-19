import React from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterField {
  key: string;
  label: string;
  type: 'search' | 'select' | 'multiselect' | 'date' | 'daterange';
  options?: FilterOption[];
  placeholder?: string;
  value?: any;
  onChange?: (value: any) => void;
}

interface CleanFiltersProps {
  fields: FilterField[];
  onClear?: () => void;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const CleanFilters: React.FC<CleanFiltersProps> = ({
  fields,
  onClear,
  className = '',
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const hasActiveFilters = fields.some(field => {
    if (field.type === 'search') return field.value && field.value.length > 0;
    if (field.type === 'select') return field.value && field.value !== 'all';
    if (field.type === 'multiselect') return field.value && field.value.length > 0;
    if (field.type === 'date' || field.type === 'daterange') return field.value;
    return false;
  });

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'search':
        return (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={field.placeholder || `Search ${field.label.toLowerCase()}...`}
              value={field.value || ''}
              onChange={(e) => field.onChange?.(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {field.value && (
              <button
                onClick={() => field.onChange?.('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            value={field.value || 'all'}
            onChange={(e) => field.onChange?.(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={field.value || ''}
            onChange={(e) => field.onChange?.(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        );

      case 'daterange':
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              value={field.value?.start || ''}
              onChange={(e) => field.onChange?.({ ...field.value, start: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Start date"
            />
            <input
              type="date"
              value={field.value?.end || ''}
              onChange={(e) => field.onChange?.({ ...field.value, end: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="End date"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-100 ${className}`}>
      {collapsible ? (
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-900">Filters</span>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      ) : (
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-900">Filters</span>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
            </div>
            {hasActiveFilters && onClear && (
              <button
                onClick={onClear}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {(!collapsible || isExpanded) && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
          
          {hasActiveFilters && onClear && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={onClear}
                className="flex items-center space-x-2 text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                <X className="w-4 h-4" />
                <span>Clear all filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CleanFilters;