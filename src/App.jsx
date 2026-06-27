import AppRoutes from '@/routes';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/context';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
