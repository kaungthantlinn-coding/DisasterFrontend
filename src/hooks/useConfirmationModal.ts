import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  details?: string[];
  userName?: string;
  actionType?: 'blacklist' | 'unblacklist' | 'delete' | 'general';
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  resolve?: (value: { isConfirmed: boolean }) => void;
}

export const useConfirmationModal = () => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    details: [],
    actionType: 'general'
  });

  const showConfirmation = useCallback((options: ConfirmationOptions): Promise<{ isConfirmed: boolean }> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        resolve
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (state.resolve) {
      state.resolve({ isConfirmed: true });
    }
    setState(prev => ({ ...prev, isOpen: false, resolve: undefined }));
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    if (state.resolve) {
      state.resolve({ isConfirmed: false });
    }
    setState(prev => ({ ...prev, isOpen: false, resolve: undefined }));
  }, [state.resolve]);

  // Predefined confirmation types
  const showDeleteConfirmation = useCallback((
    itemName: string,
    itemType: string = 'item',
    additionalWarning?: string
  ) => {
    const details = ['This action cannot be undone'];
    if (additionalWarning) {
      details.unshift(additionalWarning);
    }

    return showConfirmation({
      title: `Delete ${itemType}?`,
      message: `Are you sure you want to delete ${itemName}?`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      details,
      actionType: 'delete'
    });
  }, [showConfirmation]);

  const showBlacklistConfirmation = useCallback((userName: string) => {
    return showConfirmation({
      title: 'Blacklist User?',
      message: `Are you sure you want to blacklist ${userName}?`,
      type: 'warning',
      confirmText: 'Blacklist',
      cancelText: 'Cancel',
      details: [
        'Suspend their account immediately',
        'Prevent them from accessing the system',
        'Require admin intervention to restore access'
      ],
      userName,
      actionType: 'blacklist'
    });
  }, [showConfirmation]);

  const showUnblacklistConfirmation = useCallback((userName: string) => {
    return showConfirmation({
      title: 'Restore User Access?',
      message: `Are you sure you want to restore access for ${userName}?`,
      type: 'success',
      confirmText: 'Restore Access',
      cancelText: 'Cancel',
      details: [
        'Reactivate their account',
        'Allow them to access the system again',
        'Restore their previous permissions'
      ],
      userName,
      actionType: 'unblacklist'
    });
  }, [showConfirmation]);

  return {
    // Modal state and handlers
    modalProps: {
      isOpen: state.isOpen,
      onClose: handleCancel,
      onConfirm: handleConfirm,
      title: state.title,
      message: state.message,
      type: state.type,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
      details: state.details,
      userName: state.userName,
      actionType: state.actionType
    },
    
    // Confirmation functions
    showConfirmation,
    showDeleteConfirmation,
    showBlacklistConfirmation,
    showUnblacklistConfirmation
  };
};
