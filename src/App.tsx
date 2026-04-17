import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ClerkProvider, useAuth, RedirectToSignIn } from "@clerk/react";
import { ReactNode } from "react";

// Import layout and pages
import { DashboardLayout } from "./app/dashboard/layout/DashboardLayout";
import ContestantDashboard from "./app/dashboard/Dashboard";
import Settings from "./app/dashboard/Settings/Settings";
import Rules from "./app/dashboard/Rules&Regulations/Rules";
import Categories from "./app/dashboard/Categories/Category";
import Submissions from "./app/dashboard/Submissions/DigitalSubmission";
import AddContestant from "./app/dashboard/AddContestant/AddContestant";
import SignInPage from "./pages/Auth/SignInPage";
import SignUpPage from "./pages/Auth/SignUpPage";

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
}

// Protected Layout Component
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Routes Component (inside ClerkProvider context)
function AppRoutes() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
      
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<ContestantDashboard />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/add-contestant" element={<AddContestant />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Missing Publishable Key. Go to the Clerk dashboard and copy your key.');
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ClerkProvider>
  );
}