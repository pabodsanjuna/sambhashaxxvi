import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useStaffProfile } from '../hooks/useStaffProfile';

export function RequireRole({ allowedRoles }: { allowedRoles: string[] }) {
  const { isLoaded, user } = useUser();
  const { staffProfile, loading: profileLoading } = useStaffProfile();
  const location = useLocation();

  if (!isLoaded || profileLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Determine user role from default public metadata, or default to generic role if none is present for test scenarios.
  // In a real application, ensure publicMetadata.role is properly configured via Clerk.
  const role = (user.publicMetadata?.role as string) || '';

  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-zinc-400 max-w-md mb-8">
          You do not have the required permissions '{allowedRoles.join(' or ')}' to view this page.
        </p>
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-left max-w-lg mt-6">
           <h3 className="text-sm font-bold text-white mb-2 uppercase">Developer Note:</h3>
           <p className="text-sm text-zinc-400 mb-4">
              To test this flow, go to your Clerk Dashboard -&gt; Users -&gt; Select your user -&gt; Scroll down to Metadata -&gt; Public Metadata and add:
           </p>
           <pre className="bg-black/50 p-3 rounded-md font-mono text-xs text-green-400 border border-white/10">
{`{
  "role": "${allowedRoles[0]}"
}`}
           </pre>
           <p className="text-sm text-zinc-400 mt-4 italic">
              After saving, you must refresh the app so the claims are re-loaded.
           </p>
        </div>
      </div>
    );
  }

  // If user is allowed but has no staff profile, redirect to staff onboarding
  if (!staffProfile && location.pathname !== '/staff-onboarding') {
    return <Navigate to="/staff-onboarding" replace />;
  }

  return <Outlet />;
}
