export type UserRole = 'user' | 'admin' | 'superAdmin' | 'HR Admin' | 'Coordinator';

export interface UserClaims {
  name: string;
  email: string;
  roles: UserRole[];
}
