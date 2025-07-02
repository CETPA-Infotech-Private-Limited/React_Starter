import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';

const useUserRoles = () => {
  const { Roles } = useSelector((state: RootState) => state.user);

  const isSuperAdmin = Roles.includes('superAdmin');
  const isAdmin = Roles.includes('admin');
  const isUser = Roles.includes('user');

  return {
    isSuperAdmin,
    isAdmin,
    isUser,
    Roles,
  };
};

export default useUserRoles;
