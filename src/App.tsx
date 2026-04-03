import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./pages/Auth/Auth";
import { LoginForm, RegisterForm } from "./pages/Auth/Subcomponents/AuthSC";
import ResetPassword from "./pages/Auth/ResetPassword";

// Import the Mainrender layout and child pages
import Mainrender from "./pages/User/MainRender";
import Dashboard from "./pages/User/Dashbaord/Dashboard";
import RulesRegulationsContent from "./pages/User/Rules&Regulations/RulesContent";
import Categories from "./pages/User/Categories/Category";
import Settings from "./pages/User/Settings/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AuthLayout wraps the routes to maintain the background, Header, and Footer */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Dashboard Flow using Mainrender as a Pathless Layout Route */}
        <Route element={<Mainrender />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rules" element={<RulesRegulationsContent />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          {/* Future routes will go here, e.g.: */}
          {/* <Route path="/submissions" element={<Submissions />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}