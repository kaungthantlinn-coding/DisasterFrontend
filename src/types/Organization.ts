// Organization types based on backend DTOs
export interface OrganizationDto {
  id: number
  name: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  contactEmail?: string
  createdAt?: string
}

export interface CreateOrganizationDto {
  name: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  contactEmail?: string
}

export interface UpdateOrganizationDto {
  name: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  contactEmail?: string
}
