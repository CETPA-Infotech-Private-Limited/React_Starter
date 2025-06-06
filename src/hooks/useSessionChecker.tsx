import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useAppDispatch } from '@/app/hooks';
import { useNavigate } from 'react-router';
import { SESSION_CHECK_INTERVAL } from '@/config';
import toast from 'react-hot-toast';

export const useSessionChecker = () => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await auth.signinSilent();
        console.log('[Session] Silent renewal succeeded');
      } catch (error) {
        toast.error('Session expired. Please log in again.');

        // Destroy everything
        // dispatch(clearAuthData());
        // dispatch(clearUserProfile());
        // auth.removeUser(); // clears stored user from oidc-client
        // navigate('/session-expired', { replace: true });
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [auth.isAuthenticated]);
};
