import React, { useState, useMemo, useCallback } from "react";
import ViewProfileModal from "../../components/modals/ViewProfileModal";
import RoleEditModal from "../../components/modals/RoleEditModal";
import UserHistoryModal from "../../components/modals/UserHistoryModal";
import ExportUsersModal from "../../components/modals/ExportUsersModal";
import UserManagementCharts from "../components/UserManagementCharts";
import SimpleAddUserModal from "../../components/modals/SimpleAddUserModal";
import {
  Users,
  Search,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  MoreVertical,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Ban,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  History,
  Calendar,
  Mail,
  Phone,
  Download,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { useUserManagement } from "../../hooks/useUserManagement";
import { useConfirmationModal } from "../../hooks/useConfirmationModal";
import { useAuthStore } from "../../stores/authStore";
import { useCurrentUserPermissions } from "../../hooks/userPermissions";
import Avatar from "../../components/Common/Avatar";
import { extractPhotoUrl } from "../../utils/avatarUtils";
import {
  showSuccessToast,
  showErrorToast,
  showLoading,
  closeAlert,
} from "../../utils/notifications";
import signalRService from "../../services/signalRService";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import BlacklistHistory from "../../components/ui/BlacklistHistory";

// Map API user to local user interface
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "cj" | "user";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  location?: string;
  reportsCount: number;
  lastActive: string;
  photoUrl?: string;
  roleNames?: string[]; // Add roleNames to preserve full role data
}

// Enhanced sorting and filtering types for professional table management
type SortField =
  | "name"
  | "email"
  | "role"
  | "status"
  | "joinDate"
  | "lastActive"
  | "reportsCount";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// Helper function to map API user to local user
const mapApiUserToLocal = (apiUser: any): User => {
  // Determine primary role (case-insensitive check)
  const roleNames = apiUser.roleNames || [];
  const hasRole = (roleName: string) =>
    roleNames.some(
      (role: string) => role.toLowerCase() === roleName.toLowerCase()
    );

  const primaryRole = hasRole("admin")
    ? "admin"
    : hasRole("cj")
    ? "cj"
    : "user";

  // Determine status - handle both UserListItemDto and UserDetailsDto
  const status = apiUser.isBlacklisted
    ? "suspended"
    : apiUser.status
    ? apiUser.status
    : "active";

  // Use the centralized photo URL extraction utility

  return {
    id: apiUser.userId,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    role: primaryRole,
    status,
    joinDate: apiUser.createdAt
      ? new Date(apiUser.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown",
    location: apiUser.location,
    reportsCount: apiUser.reportsCount || 0,
    lastActive: apiUser.lastActive || "Unknown",
    photoUrl: extractPhotoUrl(apiUser),
    roleNames: roleNames, // Preserve the full roleNames array
  };
};

interface UserRowProps {
  user: User;
  onViewProfile: (user: User) => void;
  onEdit: (user: User) => void;
  onBlacklist: (userId: string) => void;
  onUnblacklist: (userId: string) => void;
  onDelete: (userId: string) => void;
  onViewHistory: (user: User) => void;
  onViewBlacklistHistory: (user: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({
  user,
  onViewProfile,
  onEdit,
  onBlacklist,
  onUnblacklist,
  onDelete,
  onViewHistory,
  onViewBlacklistHistory,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "cj":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "user":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "inactive":
        return <Clock className="w-4 h-4" />;
      case "suspended":
        return <Ban className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <tr className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 group border-b border-gray-100 hover:border-blue-200">
      {/* Enhanced User Column */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center">
          <Avatar
            src={user.photoUrl}
            alt={user.name}
            name={user.name}
            size="lg"
            className="shadow-md group-hover:shadow-lg transition-all duration-200 ring-2 ring-white group-hover:ring-blue-200"
          />
          <div className="ml-4 min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 truncate">
              {user.name}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200 truncate flex items-center">
              <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
              {user.email}
            </div>
            {user.phone && (
              <div className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors duration-200 truncate flex items-center mt-1">
                <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                {user.phone}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Enhanced Role Column */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-all duration-200 group-hover:shadow-md ${getRoleColor(
            user.role
          )}`}
        >
          <Shield className="w-3 h-3 mr-1.5" />
          {user.role.toUpperCase()}
        </span>
      </td>

      {/* Enhanced Status Column */}
      <td className="px-6 py-5 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-all duration-200 group-hover:shadow-md ${getStatusColor(
            user.status
          )}`}
        >
          {getStatusIcon(user.status)}
          <span className="ml-1.5">
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </span>
      </td>

      {/* Enhanced Join Date Column */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">{user.joinDate}</span>
        </div>
      </td>

      {/* Enhanced Reports Activity Column */}
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {user.role === "cj" ? (
            <>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">
                  {user.reportsCount}
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  Verified
                </span>
              </div>
              <div
                className={`w-3 h-3 rounded-full shadow-sm ${
                  user.reportsCount > 50
                    ? "bg-green-500"
                    : user.reportsCount > 25
                    ? "bg-yellow-500"
                    : user.reportsCount > 0
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
                title={`${user.reportsCount} reports verified`}
              ></div>
            </>
          ) : (
            <div className="flex flex-col">
              <span className="text-sm text-gray-400 font-medium">N/A</span>
              <span className="text-xs text-gray-400">
                {user.role === "admin"
                  ? "No report duties"
                  : "No report duties"}
              </span>
            </div>
          )}
        </div>
      </td>
      {/* Enhanced Actions Column */}
      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all duration-200 group-hover:bg-blue-50 shadow-sm hover:shadow-md"
            title="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showActions && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-2xl z-30 min-w-[200px] overflow-hidden backdrop-blur-sm">
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50">
                  User Actions
                </div>
                <button
                  onClick={() => {
                    onViewProfile(user);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 flex items-center space-x-3 transition-all duration-200"
                >
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">View Profile</span>
                </button>
                <button
                  onClick={() => {
                    onEdit(user);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 flex items-center space-x-3 transition-all duration-200"
                >
                  <Edit className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Edit User</span>
                </button>
                <button
                  onClick={() => {
                    onViewHistory(user);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 flex items-center space-x-3 transition-all duration-200"
                >
                  <History className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">View History</span>
                </button>
                <button
                  onClick={() => {
                    onViewBlacklistHistory(user);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 flex items-center space-x-3 transition-all duration-200"
                >
                  <Ban className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Blacklist History</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>

                {/* Enhanced Conditional Blacklist/Unblacklist Button */}
                {user.status === "suspended" ? (
                  <button
                    onClick={() => {
                      onUnblacklist(user.id);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 flex items-center space-x-3 transition-all duration-200"
                  >
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Restore Access</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onBlacklist(user.id);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 flex items-center space-x-3 transition-all duration-200"
                  >
                    <Ban className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">Suspend Access</span>
                  </button>
                )}

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={() => {
                    onDelete(user.id);
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 flex items-center space-x-3 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Delete User</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const UserManagement: React.FC = () => {
  // Modal state
  const [viewProfileModal, setViewProfileModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [roleEditModal, setRoleEditModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [userHistoryModal, setUserHistoryModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [blacklistHistoryModal, setBlacklistHistoryModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({ isOpen: false, userId: "", userName: "" });

  const [exportUsersModal, setExportUsersModal] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });

  const [createUserModal, setCreateUserModal] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });

  // Charts visibility state
  const [showCharts, setShowCharts] = useState(true);
  const { isSuperAdmin } = useCurrentUserPermissions();

  // Use the custom hook for API integration
  const {
    users: apiUsers,
    totalCount,
    totalPages: apiTotalPages,
    currentPage,
    pageSize,
    availableRoles,
    isLoading,
    isLoadingRoles,
    error,
    filters,
    setPage,
    setPageSize,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    refresh,
    blacklistUser,
    unblacklistUser,
    deleteUser,
    updateUser,
  } = useUserManagement({
    initialPageSize: 10,
    autoRefresh: false,
  });

  // Use the confirmation modal hook
  const {
    modalProps,
    showBlacklistConfirmation,
    showUnblacklistConfirmation,
    showDeleteConfirmation,
  } = useConfirmationModal();

  // Convert API users to local format - handle undefined/null apiUsers
  const mappedUsers: User[] = (apiUsers || []).map(mapApiUserToLocal);

  // Enhanced sorting state
  const [localSortConfig, setLocalSortConfig] = useState<SortConfig>({
    field: "name",
    direction: "asc",
  });

  // Sorting function
  const handleSort = useCallback((field: SortField) => {
    setLocalSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Sort users based on current sort configuration
  const localSortedUsers = useMemo(() => {
    if (!mappedUsers.length) return [];

    return [...mappedUsers].sort((a, b) => {
      const { field, direction } = localSortConfig;
      let aValue = a[field];
      let bValue = b[field];

      // Handle different data types
      if (field === "reportsCount") {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (field === "joinDate" || field === "lastActive") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [mappedUsers, localSortConfig]);

  // Computed properties for pagination and display
  const computedStartIndex = ((currentPage || 1) - 1) * (pageSize || 10);
  const computedEndIndex = computedStartIndex + (pageSize || 10);
  const computedDisplayStats = {
    totalUsers: totalCount || 0,
    activeUsers: mappedUsers.filter((user) => user.status === "active").length,
    suspendedUsers: mappedUsers.filter((user) => user.status === "suspended")
      .length,
    adminUsers: mappedUsers.filter((user) => user.role === "admin").length,
  };

  const handleViewProfile = (user: User) => {
    setViewProfileModal({
      isOpen: true,
      user: user,
    });
  };

  const handleEditUser = (user: User) => {
    setRoleEditModal({
      isOpen: true,
      user: user,
    });
  };

  const handleCloseViewProfile = () => {
    setViewProfileModal({
      isOpen: false,
      user: null,
    });
  };

  const handleCloseRoleEdit = () => {
    setRoleEditModal({
      isOpen: false,
      user: null,
    });
  };

  const handleViewHistory = (user: User) => {
    setUserHistoryModal({
      isOpen: true,
      user: user,
    });
  };

  const handleViewBlacklistHistory = (user: User) => {
    setBlacklistHistoryModal({
      isOpen: true,
      userId: user.id,
      userName: user.name,
    });
  };

  const handleCloseBlacklistHistory = () => {
    setBlacklistHistoryModal({ isOpen: false, userId: "", userName: "" });
  };

  const handleCloseUserHistory = () => {
    setUserHistoryModal({
      isOpen: false,
      user: null,
    });
  };

  const handleSaveUser = async (userId: string, userData: any) => {
    try {
      // Check if this is a role update with forceUpdate flag
      if (userData.forceUpdate) {
        // Remove forceUpdate flag before sending to API
        const { forceUpdate, ...cleanUserData } = userData;

        // For confirmed role updates, use the regular updateUser API with complete payload
        // This ensures the roles array contains the final complete role list
        console.log("🔍 HandleSaveUser - Force Update Role Change:", {
          userId,
          roles: cleanUserData.roles,
          reason: cleanUserData.reason,
        });

        await updateUser(userId, cleanUserData);
      } else {
        // Regular user update with complete role list in single payload
        console.log("🔍 HandleSaveUser - Regular Role Update:", {
          userId,
          roles: userData.roles,
          reason: userData.reason,
        });

        await updateUser(userId, userData);
      }

      // Modal will close automatically on success
      handleCloseRoleEdit();
    } catch (error) {
      // Error handling is done in the hook via toast
      throw error;
    }
  };

  const handleBlacklistUser = async (userId: string) => {
    const user = mappedUsers.find((u) => u.id === userId);
    const userName = user?.name || "this user";

    // Debug: Log current authentication state
    const authState = useAuthStore.getState();
    // Prevent self-blacklist
    if (authState.user?.userId && authState.user.userId === userId) {
      showErrorToast("Cannot blacklist yourself.", "Action Not Allowed");
      return;
    }
    console.log("🔍 Blacklist Debug - Auth State:", {
      isAuthenticated: authState.isAuthenticated,
      hasUser: !!authState.user,
      hasToken: !!authState.accessToken,
      userRoles: authState.user?.roles,
      userId: authState.user?.userId,
      targetUserId: userId,
    });

    const result = await showBlacklistConfirmation(userName);

    if (result.isConfirmed && result.reason) {
      showLoading("Blacklisting user...");

      try {
        console.log("🔍 Attempting blacklist with params:", {
          userId,
          reason: result.reason,
        });
        await blacklistUser({ userId, reason: result.reason });
        closeAlert();
        showSuccessToast(
          `${userName} has been blacklisted successfully`,
          "User Blacklisted"
        );

        // Trigger SignalR data refresh to update charts in real-time
        if (signalRService.isConnected) {
          await signalRService.requestDataRefresh();
        }
      } catch (error) {
        closeAlert();
        console.error("❌ Failed to blacklist user:", error);
        console.error("❌ Error details:", {
          message: (error as any)?.message,
          status: (error as any)?.response?.status,
          statusText: (error as any)?.response?.statusText,
          data: (error as any)?.response?.data,
        });
        showErrorToast(
          "Failed to blacklist user. Please try again.",
          "Blacklist Failed"
        );
      }
    }
  };

  const handleUnblacklistUser = async (userId: string) => {
    const user = mappedUsers.find((u) => u.id === userId);
    const userName = user?.name || "this user";

    const result = await showUnblacklistConfirmation(userName);

    if (result.isConfirmed) {
      showLoading("Restoring user access...");

      try {
        await unblacklistUser(userId);
        closeAlert();
        showSuccessToast(
          `${userName}'s access has been restored successfully`,
          "Access Restored"
        );
        console.log("✅ User unblacklisted successfully:", userName);

        // Trigger SignalR data refresh to update charts in real-time
        if (signalRService.isConnected) {
          await signalRService.requestDataRefresh();
        }
      } catch (error) {
        closeAlert();
        console.error("❌ Failed to unblacklist user:", error);
        showErrorToast(
          "Failed to restore user access. Please try again.",
          "Restore Failed"
        );
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = mappedUsers.find((u) => u.id === userId);
    const userName = user?.name || "this user";

    const result = await showDeleteConfirmation(
      userName,
      "user",
      "This will permanently remove all user data, reports, and activity history."
    );

    if (result.isConfirmed) {
      showLoading("Deleting user...");

      try {
        await deleteUser(userId);
        closeAlert();
        showSuccessToast(
          `${userName} has been deleted successfully`,
          "User Deleted"
        );

        // Trigger SignalR data refresh to update charts in real-time
        if (signalRService.isConnected) {
          await signalRService.requestDataRefresh();
        }
      } catch (error) {
        closeAlert();
        console.error("Failed to delete user:", error);
        showErrorToast(
          "Failed to delete user. Please try again.",
          "Delete Failed"
        );
      }
    }
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  User Management
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage users, roles, and permissions across your platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isSuperAdmin() && (
                <button
                  onClick={() => setCreateUserModal({ isOpen: true })}
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-transparent rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add User
                </button>
              )}
              {isSuperAdmin() && (
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className={`inline-flex items-center px-6 py-3 text-sm font-semibold border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-105 ${
                    showCharts
                      ? "text-blue-700 bg-blue-50 border-blue-300 hover:bg-blue-100 shadow-md"
                      : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md"
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  {showCharts ? "Hide Analytics" : "Show Analytics"}
                </button>
              )}
              <button
                onClick={() => setExportUsersModal({ isOpen: true })}
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 border-2 border-transparent rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Total Users
                </dt>
                <dd className="text-3xl font-bold text-gray-900 mb-1">
                  {computedDisplayStats.totalUsers || 0}
                </dd>
                <div className="flex items-center text-xs text-blue-600 font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  All registered
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Active Users
                </dt>
                <dd className="text-3xl font-bold text-gray-900 mb-1">
                  {computedDisplayStats.activeUsers || 0}
                </dd>
                <div className="flex items-center text-xs text-emerald-600 font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  Currently online
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Suspended
                </dt>
                <dd className="text-3xl font-bold text-gray-900 mb-1">
                  {computedDisplayStats.suspendedUsers || 0}
                </dd>
                <div className="flex items-center text-xs text-red-600 font-medium">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Restricted access
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UserX className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Administrators
                </dt>
                <dd className="text-3xl font-bold text-gray-900 mb-1">
                  {computedDisplayStats.adminUsers || 0}
                </dd>
                <div className="flex items-center text-xs text-purple-600 font-medium">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                  Full privileges
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* User Management Charts */}
        {showCharts && isSuperAdmin() && (
          <div className="mb-8">
            <UserManagementCharts />
          </div>
        )}

        {/* Enhanced Filters */}
        {/* Enhanced Filters Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 mb-8">
          <div className="flex flex-col space-y-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Search & Filter
                  </h3>
                  <p className="text-sm text-gray-500">
                    Find and filter users by various criteria
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-xl border border-blue-100">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-700 text-lg">
                  {totalCount || 0}
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  users found
                </span>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Search Input */}
              <div className="lg:col-span-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={filters.searchTerm || ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 bg-gray-50 focus:bg-white shadow-sm hover:border-gray-300 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Role
                </label>
                <div className="relative">
                  <select
                    value={filters.role || "all"}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200 font-medium shadow-sm hover:border-gray-300 appearance-none cursor-pointer"
                    disabled={isLoadingRoles}
                  >
                    <option value="all">All Roles</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role.toLowerCase()}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="relative">
                  <select
                    value={filters.status || "all"}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-gray-50 focus:bg-white transition-all duration-200 font-medium shadow-sm hover:border-gray-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="lg:col-span-1 flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                  className="w-full px-4 py-4 text-sm font-semibold text-gray-600 bg-gray-100 border-2 border-gray-200 rounded-xl hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 transform hover:scale-105"
                  title="Clear all filters"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Professional Users Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50 border-b-2 border-gray-100">
                <tr>
                  <th
                    className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wide cursor-pointer hover:bg-blue-50/50 transition-all duration-300 group"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="group-hover:text-blue-700">
                        User Information
                      </span>
                      {localSortConfig.field === "name" && (
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          {localSortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wide cursor-pointer hover:bg-blue-50/50 transition-all duration-300 group"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="group-hover:text-purple-700">
                        Role & Permissions
                      </span>
                      {localSortConfig.field === "role" && (
                        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                          {localSortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-purple-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wide cursor-pointer hover:bg-blue-50/50 transition-all duration-300 group"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="group-hover:text-emerald-700">
                        Account Status
                      </span>
                      {localSortConfig.field === "status" && (
                        <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                          {localSortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wide cursor-pointer hover:bg-blue-50/50 transition-all duration-300 group"
                    onClick={() => handleSort("joinDate")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="group-hover:text-indigo-700">
                        Join Date
                      </span>
                      {localSortConfig.field === "joinDate" && (
                        <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                          {localSortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wide cursor-pointer hover:bg-blue-50/50 transition-all duration-300 group"
                    onClick={() => handleSort("reportsCount")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="group-hover:text-orange-700">
                        Activity
                      </span>
                      {localSortConfig.field === "reportsCount" && (
                        <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                          {localSortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-orange-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-gray-800 uppercase tracking-wide">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {isLoading ? (
                  // Enhanced Loading state
                  Array.from({ length: pageSize || 10 }).map((_, index) => (
                    <tr
                      key={`loading-${index}`}
                      className="animate-pulse hover:bg-gray-25 transition-colors"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded-lg w-32"></div>
                            <div className="h-3 bg-gray-200 rounded-lg w-48"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="h-7 bg-gray-300 rounded-full w-20"></div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="h-7 bg-gray-300 rounded-full w-24"></div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded-lg w-24"></div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded-lg w-12"></div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <div className="h-9 w-9 bg-gray-300 rounded-lg"></div>
                          <div className="h-9 w-9 bg-gray-300 rounded-lg"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  // Enhanced Error state
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Failed to load users
                          </h3>
                          <p className="text-gray-600 mb-6">
                            {error.message ||
                              "An error occurred while fetching users."}
                          </p>
                          <button
                            onClick={refresh}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Try Again
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : mappedUsers.length === 0 ? (
                  // Enhanced Empty state
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No users found
                          </h3>
                          <p className="text-gray-600">
                            Try adjusting your search or filter criteria.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data state with sorted users
                  localSortedUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onViewProfile={handleViewProfile}
                      onEdit={handleEditUser}
                      onBlacklist={handleBlacklistUser}
                      onUnblacklist={handleUnblacklistUser}
                      onDelete={handleDeleteUser}
                      onViewHistory={handleViewHistory}
                      onViewBlacklistHistory={handleViewBlacklistHistory}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Pagination with Improved Styling */}
      {localSortedUsers.length > 0 && (
        <div className="bg-gradient-to-b from-white to-gray-50 px-8 py-6 border-t border-gray-200 rounded-b-2xl shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 font-semibold">
                  Show
                </span>
                <select
                  value={pageSize || 10}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-200 focus:border-blue-500 text-sm bg-white transition-all duration-200 font-medium shadow-sm hover:border-blue-300 hover:shadow-md"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700 font-medium">
                  per page
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 bg-gray-100/70 px-4 py-2 rounded-xl">
                <span>Showing</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {computedStartIndex + 1}
                </span>
                <span>to</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {computedEndIndex}
                </span>
                <span>of</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {totalCount || 0}
                </span>
                <span>results</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-3">
              <button
                onClick={() => setPage(1)}
                disabled={(currentPage || 1) === 1}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.max((currentPage || 1) - 1, 1))}
                disabled={(currentPage || 1) === 1}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Enhanced Page Numbers */}
              <div className="hidden sm:flex items-center space-x-2">
                {Array.from(
                  { length: Math.min(5, apiTotalPages || 1) },
                  (_, i) => {
                    const safeTotalPages = apiTotalPages || 1;
                    const safeCurrentPage = currentPage || 1;
                    let pageNumber;
                    if (safeTotalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (safeCurrentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (safeCurrentPage >= safeTotalPages - 2) {
                      pageNumber = safeTotalPages - 4 + i;
                    } else {
                      pageNumber = safeCurrentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`px-4 py-2.5 text-sm rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${
                          (currentPage || 1) === pageNumber
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-600 shadow-lg transform scale-105"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() =>
                  setPage(Math.min((currentPage || 1) + 1, apiTotalPages || 1))
                }
                disabled={(currentPage || 1) === (apiTotalPages || 1)}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(apiTotalPages || 1)}
                disabled={(currentPage || 1) === (apiTotalPages || 1)}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ViewProfileModal
        user={viewProfileModal.user}
        isOpen={viewProfileModal.isOpen}
        onClose={handleCloseViewProfile}
      />

      <RoleEditModal
        user={roleEditModal.user}
        isOpen={roleEditModal.isOpen}
        onClose={handleCloseRoleEdit}
        onSave={handleSaveUser}
        availableRoles={availableRoles}
        isLoading={false}
      />

      <UserHistoryModal
        user={userHistoryModal.user}
        isOpen={userHistoryModal.isOpen}
        onClose={handleCloseUserHistory}
      />

      <BlacklistHistory
        userId={blacklistHistoryModal.userId}
        userName={blacklistHistoryModal.userName}
        isOpen={blacklistHistoryModal.isOpen}
        onClose={handleCloseBlacklistHistory}
      />

      <ExportUsersModal
        isOpen={exportUsersModal.isOpen}
        onClose={() => setExportUsersModal({ isOpen: false })}
        totalUsers={computedDisplayStats.totalUsers || 0}
        availableRoles={availableRoles}
      />

      <SimpleAddUserModal
        isOpen={createUserModal.isOpen}
        onClose={() => setCreateUserModal({ isOpen: false })}
        onSuccess={() => {
          setCreateUserModal({ isOpen: false });
          refresh(); // Refresh the user list after successful creation
        }}
      />

      {/* Beautiful Confirmation Modal */}
      <ConfirmationModal {...modalProps} />
    </div>
  );
};

export default UserManagement;
