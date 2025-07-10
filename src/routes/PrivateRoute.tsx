import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from 'react-oidc-context';
import Loader from '@/components/ui/loader';
import { fetchUserProfile } from '@/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useSessionChecker } from '@/hooks/useSessionChecker';
import { UserRole } from '@/types/auth';
import { fetchEmployees } from '@/features/employee/employeeSlice';

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles = [] }) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  useSessionChecker();

  const employees = useAppSelector((state) => state.employee.employees);
  const { loading: userLoading, Roles } = useAppSelector((state) => state.user);

  const isAuthenticated = auth.isAuthenticated;
  const isInitializing = auth.isLoading;
  const redirectHandled = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isInitializing && !redirectHandled.current) {
      redirectHandled.current = true;
      auth.signinRedirect({
        state: {
          returnUrl: location.pathname + location.search, // includes query params
        },
      });
    }
  }, [isAuthenticated, isInitializing, location.pathname, location.search, auth]);

  // After successful login
  useEffect(() => {
    if (isAuthenticated && auth.user && !redirectHandled.current) {
      redirectHandled.current = true;

      dispatch(fetchUserProfile());
      if (employees.length === 0) {
        dispatch(fetchEmployees());
      }

      // Restore the full URL (including query parameters)
      let returnUrl: string | undefined;

      if (auth.user?.state && typeof (auth.user.state as any).returnUrl === 'string') {
        returnUrl = (auth.user.state as any).returnUrl;
      }

      const fallbackUrl = location.pathname + location.search;
      navigate(returnUrl ?? fallbackUrl, { replace: true });
    }
  }, [isAuthenticated, auth.user, dispatch, employees.length, navigate, location.pathname, location.search]);

  const hasRequiredRole = allowedRoles.length === 0 || Roles?.some((role) => allowedRoles.includes(role as UserRole));

  if (!hasRequiredRole && isAuthenticated && Roles.length > 0 && !userLoading) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!isAuthenticated || userLoading) {
    return <Loader />;
  }

  return <Outlet />;
};

export default PrivateRoute;
