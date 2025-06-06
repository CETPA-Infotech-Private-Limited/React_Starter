import { Routes, Route } from 'react-router';
import PrivateRoute from './PrivateRoute';
import Unauthorized from '@/pages/unauthorized/Unauthorized';
import NotFound from '@/pages/notFound/NotFound';
import HomePage from '@/pages/home/Home';
import Dashboard from '@/pages/employee/Dashboard';
import AdminPrivateRoute from './AdminPrivateRoute';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Search from '@/pages/search/Search';
import FrontChannelLogout from '@/auth/FrontChannelLogout';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useGlobalLogout } from '@/auth/useGlobalLogout';
import { RootState } from '@/app/store';
import { useAppName } from '@/hooks/useAppName';
import { useEffect } from 'react';
import { fetchApplications } from '@/features/applications/applicationSlice';

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  useGlobalLogout();

  const applications = useAppSelector((state: RootState) => state.applications.applications);

  useEffect(() => {
    if (applications.length === 0) {
      dispatch(fetchApplications());
    }
  }, [applications, dispatch]);

  return (
    <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/logout-notification" element={<FrontChannelLogout />} />

      <Route element={<PrivateRoute allowedRoles={['employee', 'admin']} />}>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/" element={<HomePage />} /> */}
      </Route>

      <Route element={<AdminPrivateRoute />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
