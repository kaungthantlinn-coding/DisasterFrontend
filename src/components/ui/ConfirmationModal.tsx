import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, X, UserX, UserCheck, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  details?: string[];
  userName?: string;
  actionType?: 'blacklist' | 'unblacklist' | 'delete' | 'general';
  requiresReason?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon,
  details = [],
  userName,
  actionType = 'general',
  requiresReason = false
}) => {
  const [reason, setReason] = useState('');
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          border: 'border-red-200'
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          border: 'border-yellow-200'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          border: 'border-blue-200'
        };
      case 'success':
        return {
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          confirmBtn: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          border: 'border-green-200'
        };
      default:
        return {
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          confirmBtn: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
          border: 'border-gray-200'
        };
    }
  };

  const getDefaultIcon = () => {
    switch (actionType) {
      case 'blacklist':
        return <UserX className="w-6 h-6" />;
      case 'unblacklist':
        return <UserCheck className="w-6 h-6" />;
      case 'delete':
        return <Trash2 className="w-6 h-6" />;
      default:
        switch (type) {
          case 'danger':
          case 'warning':
            return <AlertTriangle className="w-6 h-6" />;
          case 'success':
            return <CheckCircle className="w-6 h-6" />;
          case 'info':
            return <Info className="w-6 h-6" />;
          default:
            return <AlertTriangle className="w-6 h-6" />;
        }
    }
  };

  const styles = getTypeStyles();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm(requiresReason ? reason : undefined);
  };

  const isConfirmDisabled = requiresReason && reason.trim().length === 0;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm" />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${styles.iconBg}`}>
                <div className={styles.iconColor}>
                  {icon || getDefaultIcon()}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                {userName && (
                  <p className="text-sm text-gray-500">
                    User: <span className="font-medium text-gray-700">{userName}</span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              {message}
            </p>

            {details.length > 0 && (
              <div className={`p-4 rounded-lg border ${styles.border} bg-gray-50`}>
                <p className="text-sm font-medium text-gray-700 mb-2">This will:</p>
                <ul className="space-y-1">
                  {details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {actionType === 'delete' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ This action cannot be undone.
                </p>
              </div>
            )}

            {actionType === 'blacklist' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 This action can be reversed later if needed.
                </p>
              </div>
            )}

            {requiresReason && (
              <div className="mt-4">
                <label htmlFor="blacklist-reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for blacklisting <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="blacklist-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for blacklisting this user..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  required
                />
                {reason.trim().length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    Please provide a reason before proceeding.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmBtn}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
