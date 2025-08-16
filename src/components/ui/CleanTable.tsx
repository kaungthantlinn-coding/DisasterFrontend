import React from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface CleanTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
}

function CleanTable<T extends Record<string, any>>({
  data,
  columns,
  sortConfig,
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  rowClassName,
  onRowClick
}: CleanTableProps<T>) {
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-blue-600" />
      : <ChevronDown className="w-3 h-3 text-blue-600" />;
  };

  const getNestedValue = (obj: T, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-slate-100 overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-4">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-slate-100 overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div className="p-12 text-center">
          <div className="text-slate-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-100 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{ width: column.width }}
                >
                  {column.sortable && onSort ? (
                    <button
                      onClick={() => onSort(column.key as string)}
                      className="flex items-center space-x-1 hover:text-slate-700 transition-colors group"
                    >
                      <span>{column.header}</span>
                      {getSortIcon(column.key as string)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-slate-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${rowClassName ? rowClassName(item, index) : ''}`}
                onClick={() => onRowClick?.(item, index)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-4 text-sm ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {column.render 
                      ? column.render(item, index)
                      : String(getNestedValue(item, column.key as string) ?? '')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CleanTable;