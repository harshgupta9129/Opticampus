import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  RefreshCw,
  Search,
  Timer,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { baseUrl } from "@/App";

const MaintenanceEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to safely create a Date object from the DB date and time strings
  const parseDateTime = (dateStr: string, timeStr: string) => {
    // Extract YYYY-MM-DD from the ISO string "2026-02-25T00:00:00.000Z"
    const datePart = dateStr.split('T')[0]; 
    return new Date(`${datePart}T${timeStr}:00`);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/maintenance/get-events`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      
      if (!res.ok) {
        setEvents([]);
        return;
      }

      const now = new Date();

      /**
       * UPDATED LOGIC:
       * 1. Access data.events (as seen in your console log)
       * 2. Properly parse date + time strings
       * 3. Filter out events that ended in the past
       * 4. Sort: LIVE events first, then upcoming
       */
      const processedEvents = (data.events || [])
        .filter((event: any) => {
          const eventEnd = parseDateTime(event.date, event.endTime);
          return eventEnd > now; // Only keep if end time is in the future
        })
        .sort((a: any, b: any) => {
          const aStart = parseDateTime(a.date, a.startTime);
          const bStart = parseDateTime(b.date, b.startTime);
          const aEnd = parseDateTime(a.date, a.endTime);
          const bEnd = parseDateTime(b.date, b.endTime);

          const aIsLive = now >= aStart && now <= aEnd;
          const bIsLive = now >= bStart && now <= bEnd;

          if (aIsLive && !bIsLive) return -1;
          if (!aIsLive && bIsLive) return 1;
          return aStart.getTime() - bStart.getTime();
        });

      setEvents(processedEvents);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  const getEventStatus = (date: string, start: string, end: string) => {
    const now = new Date();
    const eventStart = parseDateTime(date, start);
    const eventEnd = parseDateTime(date, end);

    if (now >= eventStart && now <= eventEnd) return "LIVE";
    if (now < eventStart) return "UPCOMING";
    return "ENDED";
  };

  return (
    <DashboardLayout userRole="maintenance" userName="Maintenance Staff">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold mb-2 tracking-tight text-foreground">Venue Schedule</h2>
          <p className="text-muted-foreground text-sm">
            Real-time occupancy tracking. Past events are automatically removed.
          </p>
        </div>
        <Button 
          onClick={fetchEvents} 
          variant="outline" 
          className="gap-2 shadow-sm border-primary/20 hover:bg-primary/5" 
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Sync Schedule
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h3 className="font-display text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Occupancy Overview
          </h3>
          <Badge variant="secondary" className="font-mono px-3">
            {events.length} Events Active
          </Badge>
        </div>

        <div className="divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="p-20 text-center flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse font-medium text-sm">Refreshing Data...</p>
              </div>
            ) : events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-16 text-center"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-semibold">No Events Found</h4>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm leading-relaxed">
                  There are no approved events currently active or scheduled for the future.
                </p>
              </motion.div>
            ) : (
              events.map((event) => {
                const status = getEventStatus(event.date, event.startTime, event.endTime);
                const isLive = status === "LIVE";

                return (
                  <motion.div
                    key={event._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-6 transition-all ${
                      isLive ? "bg-primary/[0.04] border-l-4 border-l-red-500 shadow-inner" : "hover:bg-muted/10"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                          isLive 
                            ? "bg-red-500 text-white border-red-600 animate-pulse" 
                            : "bg-background text-primary border-primary/20"
                        }`}>
                          {isLive ? <Timer className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-xl tracking-tight leading-none">{event.title}</h4>
                            <Badge 
                              className={isLive ? "bg-red-500 hover:bg-red-600 border-none px-3" : "bg-blue-600 border-none px-3"}
                            >
                              {status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                            <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                              <Clock className="w-4 h-4 text-primary" />
                              {new Date(event.date).toLocaleDateString() || "Venue Pending"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              Approved
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-background border border-border p-4 rounded-2xl shadow-sm min-w-[260px]">
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Time Slot</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-foreground">{event.startTime}</span>
                            <div className="h-px w-4 bg-muted-foreground/30 mx-2" />
                            <span className="text-sm font-black text-foreground">{event.endTime}</span>
                          </div>
                        </div>
                        <div className={`p-2.5 rounded-xl ${isLive ? 'bg-red-50 text-red-500' : 'bg-muted text-muted-foreground'}`}>
                          <Clock className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default MaintenanceEvents;