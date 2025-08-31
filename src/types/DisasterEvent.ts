import { DisasterReportDto } from "./DisasterReport";
import { DisasterTypeDto } from "./DisasterType";

export interface DisasterEventDto {
  id: string;
  name: string;
  disasterTypeId: number;
  disasterReport?: DisasterReportDto[];
  disasterType?: DisasterTypeDto;
}

export interface DisasterEventCreateDto {
  name: string;
  disasterTypeId: number;
}

export interface DisasterEventUpdateDto {
  id: string;
  name: string;
  disasterTypeId: number;
}
