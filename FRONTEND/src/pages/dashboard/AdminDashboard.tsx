import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Wrench, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Zap,
  Leaf,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const energyData = [
  { name: "Mon", usage: 400, saved: 100 },
  { name: "Tue", usage: 380, saved: 120 },
  { name: "Wed", usage: 350, saved: 150 },
  { name: "Thu", usage: 420, saved: 90 },
  { name: "Fri", usage: 300, saved: 180 },
  { name: "Sat", usage: 200, saved: 220 },
  { name: "Sun", usage: 180, saved: 240 },
];

const recentApprovals = [
  { id: 1, title: "Tech Fest Planning", requester: "John Doe", department: "CSE", type: "event" },
  { id: 2, title: "Physics Lab Extra Hours", requester: "Jane Smith", department: "Physics", type: "class" },
  { id: 3, title: "Cultural Club Meeting", requester: "Mike Wilson", department: "Arts", type: "event" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout userRole="admin" userName="Dr. Sarah Admin">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">Campus Overview</h2>
        <p className="text-muted-foreground">
          Monitor and manage all campus operations from one place.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Rooms", value: "24", change: "+3", trend: "up", icon: Building2 },
          { label: "Pending Requests", value: "18", change: "-5", trend: "down", icon: FileText },
          { label: "Energy Saved Today", value: "340 kWh", change: "+12%", trend: "up", icon: Zap },
          { label: "Open Tickets", value: "7", change: "-2", trend: "down", icon: Wrench },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === "up" ? "text-success" : "text-warning"
              }`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-display font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Energy chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold">Energy Usage vs Savings</h3>
              <p className="text-sm text-muted-foreground">This week's sustainability metrics</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Saved</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem"
                }}
              />
              <Area type="monotone" dataKey="usage" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsage)" />
              <Area type="monotone" dataKey="saved" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorSaved)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="font-display text-lg font-semibold mb-6">Sustainability Score</h3>
          
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 70 * 0.78} ${2 * Math.PI * 70}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold">78%</span>
              <span className="text-sm text-muted-foreground">Efficiency</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paper Saved</span>
              <span className="font-medium">2,340 sheets</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CO₂ Reduced</span>
              <span className="font-medium">128 kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Response</span>
              <span className="font-medium">2.4 hrs</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending approvals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-display text-lg font-semibold">Pending Approvals</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/requests">View All</Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {recentApprovals.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.requester} • {item.department}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Reject</Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
