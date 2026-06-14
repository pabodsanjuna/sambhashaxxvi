import { Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { AuthForm } from './components/AuthForm';
import { SignUpForm } from './components/SignUpForm';
import { Auth_Page_Bg } from './components/Auth_Page_Bg';
import { Outlet } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { RequireRole } from './components/RequireRole';

// Landing Page
import { LandingPage } from './App/LandingPage/LandingPage';

// User imports
import { Onboarding } from './App/User/Onboarding';
import { OnboardingSuccess } from './App/User/OnboardingSuccess';
import { StaffOnboarding } from './App/User/StaffOnboarding';
import { Dashboard } from './App/User/Dashboard';
import { DashboardLayout } from './App/User/DashboardLayout';
import { AddContestant } from './App/User/AddContestant';
import { AddSubmission } from './App/User/AddSubmission';
import { SubmissionsList } from './App/User/SubmissionsList';
import { Settings } from './App/User/Settings';
import { Notifications } from './App/User/Notifications';

// Admin imports
import { AdminLayout } from './App/Admin/AdminLayout';
import { AdminDashboard } from './App/Admin/AdminDashboard';
import { AdminSchools } from './App/Admin/AdminSchools';
import { AdminSchoolDetails } from './App/Admin/AdminSchoolDetails';
import { AdminContestants } from './App/Admin/AdminContestants';
import { AdminSettings } from './App/Admin/AdminSettings';
import { AdminNotifications } from './App/Admin/AdminNotifications';
import { AdminSubmissions } from './App/Admin/AdminSubmissions';

// Attendance imports
import { AttendanceApp } from './App/Attendance/AttendanceApp';
import { AttendanceDashboard } from './App/Attendance/AttendanceDashboard';
import { AttendanceScanner } from './App/Attendance/AttendanceScanner';
import { AttendanceScannerView } from './App/Attendance/AttendanceScannerView';
import { RemoteScanner } from './App/Attendance/RemoteScanner';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/remote-scanner" element={<RemoteScanner />} />
        <Route path="/staff-onboarding" element={<StaffOnboarding />} />
      <Route element={<Auth_Page_Bg />}>
        <Route path="/sign-in/*" element={<AuthForm />} />
        <Route path="/sign-up/*" element={<SignUpForm />} />
      </Route>
        
        {/* Admin Flow */}
        <Route element={<RequireRole allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/schools" element={<AdminSchools />} />
            <Route path="/admin/schools/:schoolId" element={<AdminSchoolDetails />} />
            <Route path="/admin/contestants" element={<AdminContestants />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
          </Route>
        </Route>

        {/* Event Day / Attendance Flow */}
        <Route element={<RequireRole allowedRoles={['admin', 'registrar']} />}>
          <Route element={<AttendanceApp />}>
            <Route path="/attendance" element={<AttendanceDashboard />} />
            <Route path="/attendance/scan" element={<AttendanceScanner />} />
            <Route path="/attendance/:schoolId" element={<AttendanceScannerView />} />
          </Route>
        </Route>

        {/* School Coordinator Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding-success" element={<OnboardingSuccess />} />
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/add-contestant" element={<AddContestant />} />
            <Route path="/dashboard/add-submission" element={<AddSubmission />} />
            <Route path="/dashboard/submissions" element={<SubmissionsList />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
            <Route path="/category" element={<Dashboard />} />
            <Route path="/guidelines" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Catch-all redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  );
}

