import { SeverityLevel } from "./DisasterReport";

export interface ImpactDetailCreateDto {
  impactTypeId?: number;
  impactTypeName?: string;
  description: string;
  severity: SeverityLevel;
}
