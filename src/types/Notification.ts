export interface NotificationDTO {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
  userId: string;
  userName: string;
  disasterReportId?: string; // for deep-linking to review page
  disasterReportTitle?: string | null;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  disasterReportId: string;
}
export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  isRead?: boolean;
  readAt?: string;
  type?: NotificationType;
}

export enum NotificationType {
  ReportSubmitted = 0,
  ReportApproved = 1,
  ReportRejected = 2,
}
