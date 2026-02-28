import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Wrench,
  Leaf,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import useGetEventsForStudents from "@/hooks/GetEventsForStudents";
import { baseUrl } from "@/App";

const StudentDashboard = () => {
  const [green, setGreen] = useState(0);
  useGetEventsForStudents();
  
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.name || "Student";
  
  const { totalEvents, totalSuccessRequests, totalPendingRequests } = useSelector(
    (state: RootState) => state.events
  );

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/student/get-green-point`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        setGreen(data?.greenPoint ?? 0);
      } catch (error) {
        console.error("Failed to fetch green points:", error);
      }
    };

    fetchPoints();
  }, []);

  const stats = [
    {
      label: "Active Requests",
      value: totalPendingRequests,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-200/50",
    },
    {
      label: "Approved Requests",
      value: totalSuccessRequests,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-200/50",
    },
    {
      label: "Total Reported",
      value: totalEvents,
      icon: Wrench,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-200/50",
    },
  ];

  return (
    <DashboardLayout userRole="student" userName={userName}>
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome back, {userName}!
          </h2>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your campus activities.
          </p>
        </div>

        {/* Improved Green Points Badge */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative flex items-center gap-4 bg-card border border-border/50 p-3 pr-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
              <Leaf className="w-6 h-6 fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Green Points
              </span>
              <span className="text-2xl font-display font-bold text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">
                {green}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-card border ${stat.border || 'border-border'} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-3xl font-display font-bold">
                {stat.value}
              </span>
            </div>
            <p className="font-medium text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 className="font-display text-xl font-bold mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground shadow-lg shadow-primary/20 group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-32 h-32 transform rotate-12 translate-x-8 -translate-y-8" />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">
              Request an Event
            </h3>
            <p className="text-primary-foreground/90 mb-8 max-w-sm leading-relaxed">
              Book a room for your next class, meeting, or campus event seamlessly.
            </p>
            <Button variant="secondary" size="lg" asChild className="shadow-lg hover:shadow-xl transition-all">
              <Link to="/dashboard/student/request">
                Create Request <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-lg shadow-orange-500/20 group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wrench className="w-32 h-32 transform -rotate-12 translate-x-8 -translate-y-8" />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">
              Report an Issue
            </h3>
            <p className="text-white/90 mb-8 max-w-sm leading-relaxed">
              Spot a maintenance problem? Report it instantly and earn Green Points!
            </p>
            <Button variant="secondary" size="lg" asChild className="text-orange-600 shadow-lg hover:shadow-xl transition-all">
              <Link to="/dashboard/student/maintenance">
                Create Issue <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;