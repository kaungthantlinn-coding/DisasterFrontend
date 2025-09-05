// types/Donate.ts
// Assumed TypeScript type (based on your frontend and backend)
export interface CreateDonationDto {
  donorName: string;
  donorContact?: string;
  donationType: string; // Should match DonationType enum (KPay, WavePay, CBPay, BankAccount)
  amount?: number;
  description: string;
  transactionPhoto?: File;
}

export interface DonationDto {
  id: number;
  donorName: string;
  donorContact?: string;
  donationType: string;
  amount: number;
  description: string;
  transactionPhotoUrl?: string;
  date?: string;
  note?: string;
  
}
export interface PendingDonationDto {
  id: number;
  donorName: string;
  userName?: string; // Added UserName
  donorContact?: string;
  donationType: string;
  amount?: number;
  description: string;
  receivedAt: string;
  status: string;
  transactionPhotoUrl?: string;
}
export enum DonationType {
  KPay = "KPay",
  WavePay = "WavePay",
  CBPay = "CBPay",
  BankAccount = "BankAccount",
}

export enum DonationStatus {
  Pending = "Pending",
  Verified = "Verified",
}
export interface DonationStatsDto {
  verifiedDonations: number;
  verifiedDonors: number;
  averageVerifiedDonation: number;
  verifiedThisMonthDonations: number; // Corrected typo for frontend consistency
}
