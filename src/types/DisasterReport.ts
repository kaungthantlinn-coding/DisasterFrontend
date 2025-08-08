import { DisasterCategory } from "./DisasterType";
import { ImpactDetailCreateDto } from "./ImpactDetail";

export interface DisasterReportCreateDto {
  title: string;
  description: string;
  timestamp: string;
  severity: SeverityLevel;
  disasterCategory?: DisasterCategory;
  disasterTypeId: number;
  newDisasterTypeName?: string;
  disasterEventName?: string;

  // location: {
  //   address: string;
  //   lat: number;
  //   lng: number;
  // };

  impactDetails: ImpactDetailCreateDto[];

  // photos: File[]; // or string[] if uploaded separately
}

export interface DisasterReportDto {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: SeverityLevel;
  status: string;
  disasterTypeName: string;
  userId: string;
  impactDetails: ImpactDetailCreateDto[];
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

export enum SeverityLevel {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}
