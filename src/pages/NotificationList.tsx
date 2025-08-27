import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bell, CheckCircle, XCircle, Clock } from "lucide-react";
import { NotificationAPI } from "../services/Notification";
import { NotificationDTO, NotificationType } from "../types/Notification";
import { useAuthStore } from "../stores/authStore";

const NotificationList: React.FC = () => {
  const { accessToken } = useAuthStore((state) => ({
    accessToken: state.accessToken,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery<NotificationDTO[]>({
    queryKey: ["userNotifications"],
    queryFn: () => NotificationAPI.getUserNotifications(accessToken || undefined),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    enabled: !!accessToken, // Only fetch if token exists
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationAPI.markAsRead(notificationId, accessToken || undefined);
      // Refetch notifications to update UI
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationAPI.markAllAsRead(accessToken || undefined);
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ReportApproved:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case NotificationType.ReportRejected:
        return <XCircle className="w-5 h-5 text-red-500" />;
      case NotificationType.ReportSubmitted:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {notifications.some((n) => !n.isRead) && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          {isLoading && (
            <div className="p-4 text-sm text-gray-500">
              Loading notifications...
            </div>
          )}
          {error && (
            <div className="p-4 text-sm text-red-500">
              Failed to load notifications.
            </div>
          )}
          {notifications.length === 0 && !isLoading && !error && (
            <div className="p-4 text-sm text-gray-500">No notifications.</div>
          )}
          {notifications.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 flex items-start space-x-3 ${
                    notification.isRead ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {notification.disasterReportId && (
                      <Link
                        to={`/report/${notification.disasterReportId}`}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                        onClick={() => setIsOpen(false)}
                      >
                        View Report
                      </Link>
                    )}
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationList;