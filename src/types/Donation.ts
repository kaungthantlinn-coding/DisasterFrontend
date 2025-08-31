



// types/Donate.ts
export interface CreateDonationDto {
  donorName: string;
  donorContact?: string;
  donationType: string;
  amount?: number;
  description: string;
  transactionPhoto?: File;
}

export interface DonationDto {
  id: number;
  donorName: string;
  donorContact?: string;
  donationType: string;
  amount?: number;
  description: string;
  receivedAt: string;
  status: string;
  transactionPhotoUrl?: string;
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
  BankAccount = "BankAccount"
}

export enum DonationStatus {
  Pending = "Pending",
  Verified = "Verified"
}
