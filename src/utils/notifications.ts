import toast from "react-hot-toast";

// Enhanced react-hot-toast configuration for DisasterWatch application
// Professional disaster management styling with enhanced visual design and i18n support

/**
 * Detect current language for i18n support
 */
const getCurrentLanguage = (): string => {
  return document.documentElement.lang || "en";
};

/**
 * Enhanced toast styling options for disaster management theme
 */
const getToastStyle = (
  type: "success" | "error" | "warning" | "info" | "loading"
) => {
  const baseStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    color: "#1f2937",
    border: "1px solid rgba(229, 231, 235, 0.3)",
    borderRadius: "16px",
    boxShadow:
      "0 12px 28px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.08)",
    backdropFilter: "blur(16px) saturate(1.3)",
    WebkitBackdropFilter: "blur(16px) saturate(1.3)",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    fontSize: "15px",
    fontWeight: "500",
    padding: "16px 20px",
    minHeight: "72px",
  };

  const typeStyles = {
    success: {
      ...baseStyle,
      background:
        "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
      borderLeft: "5px solid rgb(16, 185, 129)",
      color: "#065f46",
    },
    error: {
      ...baseStyle,
      background:
        "linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
      borderLeft: "5px solid rgb(220, 38, 38)",
      color: "#7f1d1d",
    },
    warning: {
      ...baseStyle,
      background:
        "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
      borderLeft: "5px solid rgb(245, 158, 11)",
      color: "#78350f",
    },
    info: {
      ...baseStyle,
      background:
        "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
      borderLeft: "5px solid rgb(99, 102, 241)",
      color: "#3730a3",
    },
    loading: {
      ...baseStyle,
      background:
        "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)",
      borderLeft: "5px solid rgb(59, 130, 246)",
      color: "#1e3a8a",
    },
  };

  // Adjust for Myanmar language
  const currentLanguage = getCurrentLanguage();
  if (currentLanguage === "my") {
    return {
      ...typeStyles[type],
      fontFamily: "'Noto Sans Myanmar', 'Myanmar Text', 'Padauk', sans-serif",
      lineHeight: "1.8",
      letterSpacing: "0.025em",
    };
  }

  return typeStyles[type];
};

/**
 * Enhanced success notification toast with disaster management styling
 */
export const showSuccessToast = (message: string, title?: string) => {
  const displayText = title ? `${title}\n${message}` : message;

  return toast.success(displayText, {
    duration: 4500,
    style: getToastStyle("success"),
    iconTheme: {
      primary: "rgb(16, 185, 129)",
      secondary: "#fff",
    },
  });
};

/**
 * Enhanced error notification toast with disaster management styling
 */
export const showErrorToast = (message: string, title?: string) => {
  const displayText = title ? `${title}\n${message}` : message;

  return toast.error(displayText, {
    duration: 5500,
    style: getToastStyle("error"),
    iconTheme: {
      primary: "rgb(220, 38, 38)",
      secondary: "#fff",
    },
  });
};

/**
 * Enhanced warning notification toast with disaster management styling
 */
export const showWarningToast = (message: string, title?: string) => {
  const displayText = title ? `${title}\n${message}` : message;

  return toast(displayText, {
    duration: 5000,
    style: getToastStyle("warning"),
    icon: "⚠️",
  });
};

/**
 * Enhanced info notification toast with disaster management styling
 */
export const showInfoToast = (message: string, title?: string) => {
  const displayText = title ? `${title}\n${message}` : message;

  return toast(displayText, {
    duration: 4000,
    style: getToastStyle("info"),
    icon: "ℹ️",
  });
};

/**
 * DEPRECATED: Legacy confirmation dialogs using window.confirm()
 *
 * These functions are kept for backward compatibility but should be replaced
 * with the new ConfirmationModal component for better UX.
 *
 * To use the new modal system:
 * 1. Import useConfirmationModal hook
 * 2. Add ConfirmationModal component to your JSX
 * 3. Use the hook's confirmation functions
 *
 * Example:
 * const { modalProps, showBlacklistConfirmation } = useConfirmationModal();
 * // In JSX: <ConfirmationModal {...modalProps} />
 * // Usage: const result = await showBlacklistConfirmation(userName);
 */

/**
 * @deprecated Use useConfirmationModal hook with ConfirmationModal component instead
 */
export const showDeleteConfirmation = (
  itemName: string,
  itemType: string = "item",
  additionalWarning?: string
): Promise<{ isConfirmed: boolean }> => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(
      `Delete ${itemType}?\n\nAre you sure you want to delete ${itemName}?${
        additionalWarning ? `\n\n${additionalWarning}` : ""
      }\n\nThis action cannot be undone.`
    );
    resolve({ isConfirmed: confirmed });
  });
};

/**
 * @deprecated Use useConfirmationModal hook with ConfirmationModal component instead
 */
export const showBlacklistConfirmation = (
  userName: string
): Promise<{ isConfirmed: boolean }> => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(
      `Blacklist User?\n\nAre you sure you want to blacklist ${userName}?\n\nThis will:\n• Suspend their account immediately\n• Prevent them from accessing the system\n• Require admin intervention to restore access\n\nThis action can be reversed later if needed.`
    );
    resolve({ isConfirmed: confirmed });
  });
};

/**
 * @deprecated Use useConfirmationModal hook with ConfirmationModal component instead
 */
export const showUnblacklistConfirmation = (
  userName: string
): Promise<{ isConfirmed: boolean }> => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(
      `Restore User Access?\n\nAre you sure you want to restore access for ${userName}?\n\nThis will:\n• Reactivate their account\n• Allow them to access the system again\n• Restore their previous permissions`
    );
    resolve({ isConfirmed: confirmed });
  });
};

/**
 * @deprecated Use useConfirmationModal hook with ConfirmationModal component instead
 */
export const showConfirmation = (
  title: string,
  message: string,
  confirmText: string = "Confirm",
  cancelText: string = "Cancel",
  type: "warning" | "question" | "info" = "question"
): Promise<{ isConfirmed: boolean }> => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(`${title}\n\n${message}`);
    resolve({ isConfirmed: confirmed });
  });
};

/**
 * Enhanced loading dialog
 */
let loadingToastId: string | null = null;

export const showLoading = (message: string = "Processing...") => {
  if (loadingToastId) {
    toast.dismiss(loadingToastId);
  }

  loadingToastId = toast.loading(message, {
    duration: Infinity,
    style: getToastStyle("loading"),
    position: "top-center",
  });

  return { close: () => toast.dismiss(loadingToastId!) };
};

/**
 * Close any open toast
 */
export const closeAlert = () => {
  if (loadingToastId) {
    toast.dismiss(loadingToastId);
    loadingToastId = null;
  } else {
    toast.dismiss();
  }
};

/**
 * Success dialog for completed operations
 */
export const showSuccess = (
  title: string,
  message: string,
  confirmText: string = "OK"
) => {
  const displayText = `${title}\n${message}`;
  return toast.success(displayText, {
    duration: 4000,
    style: getToastStyle("success"),
    position: "top-center",
  });
};

/**
 * Error dialog for failed operations
 */
export const showError = (
  title: string,
  message: string,
  confirmText: string = "OK"
) => {
  const displayText = `${title}\n${message}`;
  return toast.error(displayText, {
    duration: 5000,
    style: getToastStyle("error"),
    position: "top-center",
  });
};
