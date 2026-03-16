import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallbackUI from './components/common/ErrorFallbackUI';
import { AuthProvider } from './auth/AuthProvider';
import { useEffect, useState } from 'react';
import { userManager } from './auth/userManager';
import { bootstrapFromAccessToken, stripTokenParamsFromUrl } from './auth/bootstrapFromToken';
import Loader from './components/ui/loader';

const App = () => {
  const [bootstrapped, setBootstrapped] = useState(false);
  useEffect(() => {
    (async () => {
      const qs = new URLSearchParams(window.location.search);
      const token = qs.get('access_token');
      const expiresIn = qs.get('expires_in') ? Number(qs.get('expires_in')) : undefined;
      const scope = qs.get('scope') || undefined;

      if (token) {
        const ok = await bootstrapFromAccessToken(userManager, token, { scope, expiresIn });
        if (ok) stripTokenParamsFromUrl();
      }
      setBootstrapped(true);
    })();
  }, []);

  if (!bootstrapped) return <Loader />;
  return (
    <div>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, position: 'top-right' }} />
        <ErrorBoundary fallback={<ErrorFallbackUI />}>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </div>
  );
};

export default App;
