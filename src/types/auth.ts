export type Role = 'admin' | 'editor' | 'viewer' | 'employee';

export interface UserClaims {
  name: string;
  email: string;
  roles: Role[];
}
