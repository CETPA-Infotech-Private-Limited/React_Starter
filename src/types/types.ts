import { UserRole } from './auth';

export interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}
