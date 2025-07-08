export type UserRole = 'user' | 'admin' | 'superAdmin' | 'HR2' | 'HR1' | 'Finance';

export interface UserClaims {
  name: string;
  email: string;
  roles: UserRole[];
}
