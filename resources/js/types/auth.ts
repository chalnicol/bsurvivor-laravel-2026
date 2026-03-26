export interface UserBase {
  id: number;
  full_name: string;
  username: string;
  avatar?: string;
}
export interface User extends UserBase {
  email: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  is_blocked: boolean;
  is_verified: boolean;
  unread_notifications_count: number;
  roles: Role[];
  // [key: string]: unknown;
}

export type Role = 'admin' | 'moderator' | 'spectator' | 'user';
