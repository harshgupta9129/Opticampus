import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import MaintenanceDashboard from "./pages/dashboard/MaintenanceDashboard";
import EventRequestPage from "./pages/dashboard/EventRequestPage";
import MaintenanceReportPage from "./pages/dashboard/MaintenanceReportPage";
import NotFound from "./pages/NotFound";

import MyRequestshistory from "./pages/dashboard/MyRequests";
import { store } from "./store/store";
import { Provider } from "react-redux";
import FacultyMaintenanceStatus from "./pages/dashboard/FacultyMaintenanceStatus";
import FacultyEventRequests from "./pages/dashboard/FacultyEventRequests";
import FacultyDashboard from "./pages/dashboard/FacultyDashboard";
import PapersSection from "./components/papersection/PapersSection";
import PaperUpload from "./components/papersection/PaperUpload";
import ArchiveAdmin from "./components/papersection/Archiveadmin";
import AdminNavbar from "./components/papersection/Adminnavbar";
import MaintenanceEvents from "./pages/dashboard/MaintenanceEvents";


const queryClient = new QueryClient();

export const baseUrl =
  import.meta.env.VITE_BASE_URL || "https://sustaintech.onrender.com";

// --- NAVIGATION CONTROLLER ---
const AdminNavWrapper = () => {
  const location = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Check active session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // CONDITION: Only show AdminNavbar if on the admin route AND logged in
  if (location.pathname === "/archiveadmin" && session) {
    return <AdminNavbar/>;
  }

  // Otherwise return nothing (Landing/Login pages handle their own headers)
  return null;
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          
          {/* Handles conditional Admin Navbar visibility */}
          <AdminNavWrapper />

          <Routes>
            <Route path="*" element={<Navigate to='/' />} />
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/previousyearpaper" element={<PapersSection />} />
            <Route path="/uploadpaper" element={<PaperUpload />} />

            {/* Student Dashboard */}
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/student/request" element={<EventRequestPage />} />
            <Route path="/dashboard/student/maintenance" element={<MaintenanceReportPage />} />
            <Route path="/dashboard/student/myrequest" element={<MyRequestshistory />} />

            {/* Admin */}
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            {/* Maintenance */}
            <Route path="/dashboard/maintenance" element={<MaintenanceDashboard />} />
            <Route path="/dashboard/maintenance/events" element={<MaintenanceEvents />} />

            {/* Archive Admin */}
            <Route path="/archiveadmin" element={<ArchiveAdmin />} />

            {/* Faculty */}
            <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
            <Route path="/dashboard/faculty/event-requests" element={<FacultyEventRequests />} />
            <Route path="/dashboard/faculty/maintenance-status" element={<FacultyMaintenanceStatus />} />

            {/* Catch-all */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;