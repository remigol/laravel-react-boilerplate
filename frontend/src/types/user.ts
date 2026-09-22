import type { Role } from './role';

export interface User {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
  role_names: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  roles?: number[];
}
