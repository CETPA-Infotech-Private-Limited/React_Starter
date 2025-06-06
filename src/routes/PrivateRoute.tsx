// At the top of PrivateRoute.tsx
import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from 'react-oidc-context';
import Loader from '@/components/ui/loader';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '@/features/user/userSlice';
import { useAppSelector } from '@/app/hooks';
import { Role } from '@/types/auth'; // Use your Role type if available
import AppLayout from '@/components/layout/app-layout';

interface PrivateRouteProps {
  allowedRoles?: Role[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const profile = {
    roles: ['Admin', 'Employee'],
  };
  const { loading: userLoading, unique_name } = useAppSelector((state) => state.user);
  const isAuthenticated = auth.isAuthenticated;
  const isInitializing = auth.isLoading;
  const redirectHandled = useRef(false);
  console.log('unique_name', unique_name);

  useEffect(() => {
    if (!isAuthenticated && !isInitializing && !redirectHandled.current) {
      redirectHandled.current = true;
      auth.signinRedirect({
        state: { returnUrl: location.pathname + location.search },
      });
    }
  }, [isAuthenticated, isInitializing, location.pathname, location.search, auth]);

  useEffect(() => {
    if (isAuthenticated && auth.user && !redirectHandled.current) {
      redirectHandled.current = true;
      if (!unique_name) {
        dispatch(fetchUserProfile());
      }

      const returnUrl = auth.user?.state?.returnUrl;
      navigate(returnUrl ?? location.pathname, { replace: true });
    }
  }, [isAuthenticated, auth.user, dispatch, navigate, location.pathname]);

  // // 🔐 Role-based restriction
  // if (allowedRoles && !allowedRoles.some((r) => profile.roles.includes(r))) {
  //   return <Navigate to="/unauthorized" />;
  // }

  if (isInitializing || !isAuthenticated || userLoading || !profile) {
    return <Loader />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default PrivateRoute;
