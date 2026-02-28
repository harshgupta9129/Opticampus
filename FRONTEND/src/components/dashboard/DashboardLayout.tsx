import { ReactNode, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Home,
  Calendar,
  FileText,
  Wrench,
  Settings,
  LogOut,
  Bell,
  User,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for tailwind classes

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "student" | "faculty" | "admin" | "maintenance";
  userName?: string;
}

const roleNavItems = {
  student: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/student" },
    { icon: Calendar, label: "Request Event", path: "/dashboard/student/request" },
    { icon: ClipboardList, label: "My Requests", path: "/dashboard/student/myrequest" },
    { icon: Wrench, label: "Report Issue", path: "/dashboard/student/maintenance" },
  ],
  faculty: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/faculty" },
    { icon: Calendar, label: "Event Requests", path: "/dashboard/faculty/event-requests" },
    { icon: Wrench, label: "Maintenance Status", path: "/dashboard/faculty/maintenance-status" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Admin Console", path: "/dashboard/admin" },
    { icon: ShieldCheck, label: "User Management", path: "/dashboard/admin/users" },
    { icon: BarChart3, label: "Analytics", path: "/dashboard/admin/analytics" },
  ],
  maintenance: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/maintenance" },
    { icon: Wrench, label: "Events", path: "/dashboard/maintenance/events" },
    // { icon: FileText, label: "Work Logs", path: "/dashboard/maintenance/logs" },
  ],
};

const DashboardLayout = ({
  children,
  userRole,
  userName = "User",
}: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storedUserName, setStoredUserName] = useState<string | null>(null);

  const syncUser = () => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setStoredUserName(parsed?.name || null);
      } catch {
        setStoredUserName(null);
      }
    }
  };

  useEffect(() => {
    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const displayName = useMemo(() => {
    return storedUserName || userName || "User";
  }, [storedUserName, userName]);

  const navItems = roleNavItems[userRole] || [];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 mb-2">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  OptiCampus
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Smart Solutions
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Scroll Area */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    />
                  )}
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout Section */}
          <div className="p-4 mt-auto border-t border-border bg-muted/30">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-background border border-border shadow-sm mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-muted-foreground capitalize flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {userRole}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors group rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
              <span className="font-semibold">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground capitalize">
                {userRole} Portal
              </h1>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;