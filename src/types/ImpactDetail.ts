import { SeverityLevel } from "./DisasterReport";
import { ImpactTypeDto } from "./ImpactType";

export interface ImpactDetailCreateDto {
  impactTypeIds?: number[];
  impactTypeNames?: string[];
  description: string;
  severity: SeverityLevel;

  // Keep these for backward compatibility
  impactTypeName?: string;
  impactTypeId?: number;
}

export interface ImpactDetailDto {
  id: number;
  description: string;
  severity?: SeverityLevel;
  isResolved?: boolean;
  resolvedAt?: string | null;
  impactTypeIds: number[];
  impactTypes: ImpactTypeDto[];
}
