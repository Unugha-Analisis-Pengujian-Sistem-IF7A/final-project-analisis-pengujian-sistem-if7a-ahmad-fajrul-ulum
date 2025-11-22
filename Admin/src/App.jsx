import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Components
import NotFound from "./components/LandingPage/notfound";

// Layout & Context
import AdminLayout from "./Layout/AdminLayout";
import { AdminThemeProvider } from "./context/ThemeContext";

// Pages - Admin
import DashboardAdmin from "./pages/Admin/Dashboard";
import BlogAdmin from "./pages/Admin/Blog";
import UsersAdmin from "./pages/Admin/Users";
import TestimonialsAdmin from "./pages/Admin/Testimonials";
import HeroAdmin from "./pages/Admin/Hero";
import LogoPt from "./pages/Admin/LogoPt";
import AddUsers from "./pages/Admin/AddUser";
import ProfilePage from "./pages/Admin/Profile";
import NotificationsPage from "./pages/Admin/Notification";
import Iklan from "./pages/Admin/Iklan";
import Verify2FA from "./pages/Admin/Verify2FA";
import ForgotPassword from "./pages/Admin/ForgotPassword";
import ResetPassword from "./pages/Admin/ResetPassword";

// Pages - Auth
import LoginPage from "./pages/Auth/Login";

// Blog Editor Page
import EditorBlogPage from "./components/Admin/common/BlogForm";

// Middleware
import ProtectedRoutes from "./middleware/ProtectedRoutes";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "" && location.hash === "#service") {
      const element = document.getElementById("service");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin layout protected by authentication */}
        <Route
          path="/admin"
          element={
            <ProtectedRoutes>
              <AdminThemeProvider>
                <AdminLayout />
              </AdminThemeProvider>
            </ProtectedRoutes>
          }
        >
          <Route index element={<DashboardAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="nulis" element={<EditorBlogPage />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="hero" element={<HeroAdmin />} />
          <Route path="iklan" element={<Iklan />} />
          <Route path="logo-partner" element={<LogoPt />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notification" element={<NotificationsPage />} />
          <Route path="manage-users" element={<AddUsers />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
