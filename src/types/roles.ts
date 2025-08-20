export interface Role {
  id: string | number;
  name: string;
  description?: string;
  isSystem?: boolean;
  permissions?: string[];
}
