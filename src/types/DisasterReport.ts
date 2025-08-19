import { DisasterCategory } from "./DisasterType";
import { ImpactDetailCreateDto, ImpactDetailDto } from "./ImpactDetail";
import { PhotoDto } from "./photo";

export interface DisasterReportCreateDto {
  title: string;
  description: string;
  timestamp: string;
  severity: SeverityLevel;
  disasterCategory?: DisasterCategory;
  disasterTypeId?: number;
  newDisasterTypeName?: string;
  disasterEventName?: string;
  latitude: number;
  longitude: number;
  address: string;
  coordinatePrecision?: number;

  impactDetails: ImpactDetailCreateDto[];

  photos: (File | PhotoDto)[]; // or string[] if uploaded separately
}

export interface DisasterReportDto {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: SeverityLevel;
  status: ReportStatus;
  disasterTypeName: string;
  disasterTypeId: number;
  userId: string;
  userName?: string;
  impactDetails: ImpactDetailDto[];
  photoUrls: string[];
  latitude: number;
  longitude: number;
  address: string;
  coordinatePrecision?: number;
}

export interface DisasterReportUpdateDto {
  title?: string;
  description: string;
  timestamp?: string;
  severity?: SeverityLevel;
  status?: string;
  disasterEventName?: string;
  impactDetails?: ImpactDetailCreateDto[];
}

export interface DisasterReportFilters {
  disasterType?: string;
  severity?: string;

  location?: {
    lat: number;
    lng: number;
    coordinate: number; // in kilometers
  };
  timestamp?: string;
  status?: ReportStatus;
}

export enum SeverityLevel {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export enum ReportStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Rejected = "Rejected",
}
