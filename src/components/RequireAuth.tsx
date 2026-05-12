import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function RequireAuth() {
  const { isLoaded, user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
