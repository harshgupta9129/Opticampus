import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  Wrench, 
  AlertCircle, 
  Leaf, 
  ArrowRight,
  ClipboardList,
  PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { baseUrl } from "@/App";

const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    pendingEvents: 0,
    activeIssues: 0,
  });
  const [recentIssues, setRecentIssues] = useState<any[]>([]);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const facultyName = storedUser?.name || "Faculty / HOD";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Events for count
        const eventRes = await fetch(`${baseUrl}/api/staff/get-all-events`, { credentials: "include" });
        const eventData = await eventRes.json();
        const pendingCount = eventData.events?.filter((e: any) => e.status === "Pending").length || 0;

        // Fetch Issues for count and list
        const issueRes = await fetch(`${baseUrl}/api/maintenance/get-all-issues`, { credentials: "include" });
        const issueData = await issueRes.json();
        const activeIssues = issueData.issues?.filter((i: any) => i.status === "Pending") || [];

        setStats({
          pendingEvents: pendingCount,
          activeIssues: activeIssues.length,
        });
        setRecentIssues(activeIssues.slice(0, 3)); // Show top 3 recent pending issues
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout userRole="faculty" userName={facultyName}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
            <p className="text-muted-foreground">Manage departmental approvals and infrastructure health.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/dashboard/faculty/maintenance-status">
                <Wrench className="mr-2 h-4 w-4" /> View All Issues
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/faculty/event-requests">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Review Events
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingEvents}</div>
              <p className="text-xs text-muted-foreground">Event requests awaiting your review</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Maintenance</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeIssues}</div>
              <p className="text-xs text-muted-foreground">Reported classroom or lab issues</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Access: Event Approvals */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <CardTitle>Event Management</CardTitle>
              </div>
              <CardDescription>
                Review and allocate venues for workshops, meetings, and tech fests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Pending Requests:</span>
                  <Badge variant="secondary">{stats.pendingEvents}</Badge>
                </div>
              </div>
              <Button className="w-full group" asChild>
                <Link to="/dashboard/faculty/event-requests">
                  Go to Approvals <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Access: Maintenance Tracking */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="h-5 w-5 text-orange-500" />
                <CardTitle>Infrastructure Reports</CardTitle>
              </div>
              <CardDescription>
                Track resolution status for lab equipment and facility maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {recentIssues.length > 0 ? (
                  recentIssues.map((issue) => (
                    <div key={issue._id} className="text-xs flex justify-between items-center border-b pb-2">
                      <span className="truncate max-w-[150px] font-medium">{issue.issueType}</span>
                      <Badge variant="outline" className="text-[10px]">{issue.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No new issues reported recently.</p>
                )}
              </div>
              <Button variant="outline" className="w-full group" asChild>
                <Link to="/dashboard/faculty/maintenance-status">
                  View Maintenance <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Promo: Green Points Logic */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-xl shadow-lg shadow-green-200">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Reward Green Points</h3>
              <p className="text-sm text-muted-foreground">Encourage students for reporting valid maintenance issues.</p>
            </div>
          </div>
          <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" asChild>
            <Link to="/dashboard/faculty/maintenance-status">
              <PlusCircle className="mr-2 h-4 w-4" /> Assign Points
            </Link>
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;