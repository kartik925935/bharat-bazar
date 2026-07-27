export type UserRole = 'customer' | 'seller' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}
