import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallbackUI from './components/common/ErrorFallbackUI';
import { AuthProvider } from './auth/AuthProvider';

const App = () => {
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
