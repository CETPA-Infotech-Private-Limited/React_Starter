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
import EmployeeOfTheMonth from '@/pages/user/EmployeeOfTheMonth';
import ProfileChangeRequests from '@/pages/profilechanges/ProfileChangeRequests';
// import ReviewClaim from '@/pages/hr/reviewClaim/ReviewClaim';
// import UserRoleMapping from '@/pages/admin/UserRoleMapping';
// import DirectRequestTable from '@/pages/user/raiseClaim/DirectRequestTable';
// import HospitalManagement from '@/pages/admin/HospitalManagement';
// import ApproveAdvancePage from '@/pages/hr/approveAdvance/ApproveAdvancePage';
// import BankingPage from '@/pages/finance/BankingPage';
// import MyClaim from '@/pages/user/MyClaim';
// import DoctorReview from '@/pages/doctor/DoctorReviewPage';
// import DoctorReviewPage from '@/pages/doctor/DoctorReviewPage';
// import ApproveClaimAfterDocReview from '@/components/hr2/ApproveClaimAfterDocReview';
// import HRReviewPage from '@/pages/hr/HRReviewPage';
// import RequestAdvance from '@/pages/user/RequestAdvance';
// import ReviewAdvanceRequest from '@/pages/hr/ReviewAdvanceRequest';

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
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path = "/emp-month" element={<EmployeeOfTheMonth/>}/>

            <Route path="/profile-update" element={<ProfileChangeRequests />} />
          
          </Route>
        </Route>

        <Route element={<AppLayout isAdmin={true} />}>
          <Route element={<PrivateRoute allowedRoles={['admin', 'superAdmin', 'user']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/manage-admin" element={<AdminManagement />} />
            {/* <Route path="/manage-hospital" element={<HospitalManagement />} />
            <Route path="/user-role-mapping" element={<UserRoleMapping />} /> */}
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
