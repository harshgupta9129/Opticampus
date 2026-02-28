import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Leaf, TrendingUp, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

const activities = [
  { id: 1, title: "Booked eco-friendly room", points: +15, date: "12 Feb 2026" },
  { id: 2, title: "Reported maintenance issue", points: +10, date: "10 Feb 2026" },
  { id: 3, title: "Low-energy event timing", points: +20, date: "08 Feb 2026" },
  { id: 4, title: "Paperless request submission", points: +5, date: "05 Feb 2026" },
];

const GreenPoints = () => {
  const totalPoints = 245;

  return (
    <DashboardLayout userRole="student" userName="Arun">
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Leaf className="text-green-600" />
            Green Points
          </h2>
          <p className="text-muted-foreground">
            Earn points by making eco-friendly choices on campus 🌍
          </p>
        </div>

        {/* TOTAL POINTS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Total Green Points</p>
              <h3 className="text-5xl font-bold mt-2">{totalPoints}</h3>
            </div>
            <Award className="w-16 h-16 opacity-90" />
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border rounded-xl p-6 flex gap-4 items-center">
            <TrendingUp className="text-green-600 w-8 h-8" />
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-xl font-semibold">+50 points</p>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 flex gap-4 items-center">
            <Zap className="text-yellow-500 w-8 h-8" />
            <div>
              <p className="text-sm text-muted-foreground">Eco Actions</p>
              <p className="text-xl font-semibold">12 completed</p>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 flex gap-4 items-center">
            <Leaf className="text-green-700 w-8 h-8" />
            <div>
              <p className="text-sm text-muted-foreground">CO₂ Saved</p>
              <p className="text-xl font-semibold">~18 kg</p>
            </div>
          </div>
        </div>

        {/* ACTIVITY LIST */}
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>

          <div className="space-y-4">
            {activities.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-muted/70 transition"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <span className="font-semibold text-green-600">
                  +{item.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GreenPoints;
