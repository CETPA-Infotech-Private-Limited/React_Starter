export type UserRole = 'user' | 'admin' | 'superAdmin' | 'HR2' | 'HR1';

export interface UserClaims {
  name: string;
  email: string;
  roles: UserRole[];
}
