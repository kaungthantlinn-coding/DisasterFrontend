export interface DisasterTypeDto {
  id: number;
  name: string;
  category: DisasterCategory;
}

export interface CreateDisasterTypeDto {
  name: string;
  category: DisasterCategory;
}

export interface UpdateDisasterTypeDto {
  name: string;
  category: DisasterCategory;
}

// TypeScript Enum (Frontend)
export enum DisasterCategory {
  Natural = 0,
  NonNatural = 1,
}
