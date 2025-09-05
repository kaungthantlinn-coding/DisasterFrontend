import { apiClient } from "./client";
import { UserReputationStatus, UserReportStats } from "../types";

// User reputation tracking interfaces
export interface UserReputationDto {
  userId: string;
  status: 'normal' | 'suspicious' | 'warning' | 'blacklisted';
  riskScore: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastStatusChange?: string;
  statusChangeReason?: string;
  canAppeal?: boolean;
  reportStats: UserReportStats;
}

export interface ReputationUpdateDto {
  userId: string;
  newStatus: 'normal' | 'suspicious' | 'warning' | 'blacklisted';
  reason: string;
  adminNotes?: string;
}

export interface ReputationThresholds {
  suspicious: {
    rejectRatio: number;
    riskScore: number;
  };
  warning: {
    rejectRatio: number;
    riskScore: number;
  };
  blacklisted: {
    rejectRatio: number;
    riskScore: number;
  };
}

export interface ReputationQueueItem {
  userId: string;
  userName: string;
  userEmail: string;
  photoUrl?: string;
  currentStatus: 'normal' | 'suspicious' | 'warning' | 'blacklisted';
  suggestedStatus: 'normal' | 'suspicious' | 'warning' | 'blacklisted';
  riskScore: number;
  rejectRatio: number;
  totalReports: number;
  rejectedReports: number;
  lastReportDate?: string;
  flaggedAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ReputationStatsDto {
  totalUsers: number;
  normalUsers: number;
  suspiciousUsers: number;
  warningUsers: number;
  blacklistedUsers: number;
  pendingReview: number;
  autoFlagged: number;
  appealsSubmitted: number;
}

export interface AppealDto {
  userId: string;
  reason: string;
  evidence?: string;
  contactInfo?: string;
}

export interface AppealResponseDto {
  appealId: string;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: string;
  submittedAt: string;
  reviewedAt?: string;
}

// User Reputation API Service
export const userReputationApi = {
  // Get user reputation status
  async getUserReputation(userId: string): Promise<UserReputationDto> {
    const response = await apiClient.get(`/UserReputation/${userId}`);
    return response.data;
  },

  // Get all users requiring review (admin queue)
  async getReviewQueue(): Promise<ReputationQueueItem[]> {
    const response = await apiClient.get('/UserReputation/review-queue');
    return response.data;
  },

  // Get reputation statistics for dashboard
  async getReputationStats(): Promise<ReputationStatsDto> {
    const response = await apiClient.get('/UserReputation/stats');
    return response.data;
  },

  // Update user reputation status (admin action)
  async updateUserReputation(data: ReputationUpdateDto): Promise<UserReputationDto> {
    const response = await apiClient.put('/UserReputation/update-status', data);
    return response.data;
  },

  // Calculate reputation automatically based on report stats
  async calculateReputation(userId: string): Promise<UserReputationDto> {
    const response = await apiClient.post(`/UserReputation/${userId}/calculate`);
    return response.data;
  },

  // Bulk calculate reputation for all users
  async bulkCalculateReputation(): Promise<{ processedUsers: number; message: string }> {
    const response = await apiClient.post('/UserReputation/bulk-calculate');
    return response.data;
  },

  // Get current reputation thresholds
  async getReputationThresholds(): Promise<ReputationThresholds> {
    const response = await apiClient.get('/UserReputation/thresholds');
    return response.data;
  },

  // Update reputation thresholds (super admin only)
  async updateReputationThresholds(thresholds: ReputationThresholds): Promise<ReputationThresholds> {
    const response = await apiClient.put('/UserReputation/thresholds', thresholds);
    return response.data;
  },

  // Submit appeal for status change
  async submitAppeal(appeal: AppealDto): Promise<AppealResponseDto> {
    const response = await apiClient.post('/UserReputation/appeal', appeal);
    return response.data;
  },

  // Get user's appeal history
  async getUserAppeals(userId: string): Promise<AppealResponseDto[]> {
    const response = await apiClient.get(`/UserReputation/${userId}/appeals`);
    return response.data;
  },

  // Get all pending appeals (admin)
  async getPendingAppeals(): Promise<AppealResponseDto[]> {
    const response = await apiClient.get('/UserReputation/appeals/pending');
    return response.data;
  },

  // Review appeal (admin action)
  async reviewAppeal(appealId: string, decision: 'approved' | 'rejected', adminResponse: string): Promise<AppealResponseDto> {
    const response = await apiClient.put(`/UserReputation/appeals/${appealId}/review`, {
      decision,
      adminResponse
    });
    return response.data;
  },

  // Get user report statistics
  async getUserReportStats(userId: string): Promise<UserReportStats> {
    const response = await apiClient.get(`/UserReputation/${userId}/report-stats`);
    return response.data;
  },

  // Notify user of status change
  async notifyStatusChange(userId: string, newStatus: string, reason: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/UserReputation/${userId}/notify`, {
      newStatus,
      reason
    });
    return response.data;
  }
};

// Utility functions for reputation calculation
export const reputationUtils = {
  // Calculate risk score based on various factors
  calculateRiskScore(reportStats: UserReportStats): number {
    const { totalReports, rejectedReports, rejectRatio } = reportStats;
    
    let riskScore = 0;
    
    // Base risk from reject ratio
    riskScore += rejectRatio;
    
    // Additional risk for high volume of rejections
    if (rejectedReports >= 10) riskScore += 20;
    else if (rejectedReports >= 5) riskScore += 10;
    
    // Risk reduction for users with many reports (experience factor)
    if (totalReports >= 50) riskScore -= 10;
    else if (totalReports >= 20) riskScore -= 5;
    
    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, riskScore));
  },

  // Determine user tier based on verified reports and quality
  calculateUserTier(reportStats: UserReportStats): 'bronze' | 'silver' | 'gold' | 'platinum' {
    const { verifiedReports, totalReports } = reportStats;
    const verificationRate = totalReports > 0 ? (verifiedReports / totalReports) * 100 : 0;
    
    if (verifiedReports >= 100 && verificationRate >= 80) return 'platinum';
    if (verifiedReports >= 50 && verificationRate >= 70) return 'gold';
    if (verifiedReports >= 20 && verificationRate >= 60) return 'silver';
    return 'bronze';
  },

  // Determine status based on thresholds
  calculateStatus(
    riskScore: number, 
    rejectRatio: number, 
    thresholds: ReputationThresholds
  ): 'normal' | 'suspicious' | 'warning' | 'blacklisted' {
    if (rejectRatio >= thresholds.blacklisted.rejectRatio || riskScore >= thresholds.blacklisted.riskScore) {
      return 'blacklisted';
    }
    if (rejectRatio >= thresholds.warning.rejectRatio || riskScore >= thresholds.warning.riskScore) {
      return 'warning';
    }
    if (rejectRatio >= thresholds.suspicious.rejectRatio || riskScore >= thresholds.suspicious.riskScore) {
      return 'suspicious';
    }
    return 'normal';
  },

  // Get status display information
  getStatusInfo(status: 'normal' | 'suspicious' | 'warning' | 'blacklisted') {
    const statusConfig = {
      normal: {
        label: 'Normal',
        emoji: '✅',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-200'
      },
      suspicious: {
        label: 'Suspicious',
        emoji: '⚠️',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200'
      },
      warning: {
        label: 'Warning',
        emoji: '⚠️',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-200'
      },
      blacklisted: {
        label: 'Blacklisted',
        emoji: '❌',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200'
      }
    };
    
    return statusConfig[status];
  },

  // Get tier display information
  getTierInfo(tier: 'bronze' | 'silver' | 'gold' | 'platinum') {
    const tierConfig = {
      bronze: {
        label: 'Bronze',
        emoji: '🥉',
        color: 'text-amber-600',
        bgColor: 'bg-amber-100'
      },
      silver: {
        label: 'Silver',
        emoji: '🥈',
        color: 'text-slate-600',
        bgColor: 'bg-slate-100'
      },
      gold: {
        label: 'Gold',
        emoji: '🥇',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      },
      platinum: {
        label: 'Platinum',
        emoji: '💎',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      }
    };
    
    return tierConfig[tier];
  }
};
