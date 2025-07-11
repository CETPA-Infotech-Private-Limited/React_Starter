import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import PrivateRoute from './PrivateRoute';
import Unauthorized from '@/pages/unauthorized/Unauthorized';
import NotFound from '@/pages/notFound/NotFound';
import HomePage from '@/pages/home/Home';
import Dashboard from '@/pages/user/Dashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import FrontChannelLogout from '@/auth/FrontChannelLogout';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useGlobalLogout } from '@/auth/useGlobalLogout';
import { RootState } from '@/app/store';
import { fetchApplications } from '@/features/applications/applicationSlice';
import AppLayout from '@/components/layout/app-layout';
import AdminManagement from '@/pages/admin/AdminManagement';
import Seo from '@/components/common/Seo';
import { useAppName } from '@/hooks/useAppName';

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  useGlobalLogout();
  const { fullDescription, description } = useAppName();
  const applications = useAppSelector((state: RootState) => state.applications.applications);

  useEffect(() => {
    if (applications.length === 0) {
      dispatch(fetchApplications());
    }
  }, [applications, dispatch]);

  return (
    <>
      <Seo title={fullDescription} description={description} />
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/logout-notification" element={<FrontChannelLogout />} />
        <Route element={<AppLayout isAdmin={false} />}>
          <Route element={<PrivateRoute allowedRoles={['user', 'HR Admin']} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route element={<AppLayout isAdmin={true} />}>
          <Route element={<PrivateRoute allowedRoles={['admin', 'superAdmin', 'HR Admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/manage-admin" element={<AdminManagement />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
