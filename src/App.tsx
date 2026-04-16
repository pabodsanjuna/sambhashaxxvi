import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/react";

// Import the new DashboardLayout and child pages
import DashboardLayout from "./pages/User/DashboardLayout";
import Dashboard from "./pages/User/Dashbaord/Dashboard";
import Settings from "./pages/User/Settings/Settings";
import Rules from "./pages/User/Rules&Regulations/Rules";
import Categories from "./pages/User/Categories/Category";
import Submissions from "./pages/User/Submissions/DigitalSubmission";
import AddContestant from "./pages/User/AddContestant/AddContestant";
import SignInPage from "./pages/Auth/SignInPage";
import SignUpPage from "./pages/Auth/SignUpPage";

function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  
  return <DashboardLayout />;
}

export default function App() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Missing Publishable Key. Go to the Clerk dashboard and copy your key.');
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/add-contestant" element={<AddContestant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}