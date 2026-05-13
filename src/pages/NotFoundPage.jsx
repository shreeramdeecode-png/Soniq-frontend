import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-bg">
      <div className="shell">
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <h1 className="text-7xl font-bold text-text-primary tracking-tight mb-2">404</h1>
          <p className="text-lg text-text-muted mb-6">
            The page you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/')}
            className="nav-active-pill text-white rounded-pill py-2.5 px-6 text-base font-medium cursor-pointer transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
