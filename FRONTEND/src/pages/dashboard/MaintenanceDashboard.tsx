import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl } from "@/App";

const statusStyles = {
  open: { icon: AlertTriangle, color: "text-warning" },
  in_progress: { icon: Clock, color: "text-info" },
  completed: { icon: CheckCircle2, color: "text-success" },
};

const MaintenanceDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/maintenance/get-all-issues`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Data: ", data);

        if (!res.ok) {
          return null;
        }

        setTickets(data.issues);
      } catch (err) {
        console.error(err);
      }
    };

    console.log(tickets);

    fetchTickets();
  }, []);

  const markAsSuccess = async (id) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/maintenance/update-status`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ issueId: id, status: "Success" }),
        },
      );

      if (!res.ok) return;

      // update UI instantly
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === id ? { ...ticket, status: "Success" } : ticket,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  console.log(tickets);

  return (
    <DashboardLayout userRole="maintenance" userName="Tom Maintenance">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">
          Maintenance Dashboard
        </h2>
        <p className="text-muted-foreground">
          Track and manage all maintenance tickets efficiently.
        </p>
      </div>

      {/* Ticket list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-display text-lg font-semibold">Active Tickets</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Sort
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {tickets.map((ticket) => {
            return (
              <div
                key={ticket._id}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Left side */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                      <h4 className="font-medium">{ticket.issueType}</h4>
                      <p className="text-sm text-muted-foreground">
                        {ticket?.description}
                      </p>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-3">
                    <span>Status: </span>
                    <Button
                      size="sm"
                      disabled={ticket?.status === "Success"}
                      onClick={() => markAsSuccess(ticket._id)}
                      className={
                        ticket?.status == "Success"
                          ? "bg-green-600 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }
                    >
                      {ticket?.status}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default MaintenanceDashboard;
