export interface Role {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export type RoleSlug = 'super-admin' | 'admin' | 'user' | string;
