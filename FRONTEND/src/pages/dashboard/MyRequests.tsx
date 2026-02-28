import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Wrench,
  Search,
  Calendar,
  Filter,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { baseUrl } from "@/App";

// --- Types & Config ---

interface RequestItem {
  _id: string;
  requestType: "event" | "issue";
  title?: string; // For events
  issueType?: string; // For issues
  description: string;
  status: string;
  createdAt: string;
  // Event specific
  date?: string;
  startTime?: string;
  endTime?: string;
  purpose?: string;
  expectedParticipants?: number;
  // Issue specific
  priority?: string;
  location?: string;
}

const statusConfig: Record<string, { label: string; icon: any; class: string }> = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    class: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    class: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    class: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    class: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  },
};

const MyRequestshistory = () => {
  // State
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "event" | "issue">("all");
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);

  // Fetch Data
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const [eventRes, issueRes] = await Promise.all([
          fetch(`${baseUrl}/api/student/get-events`, { credentials: "include" }),
          fetch(`${baseUrl}/api/student/get-issues`, { credentials: "include" }),
        ]);

        const eventData = await eventRes.json();
        const issueData = await issueRes.json();

        const events = (eventData.events || []).map((e: any) => ({
          ...e,
          requestType: "event",
        }));

        const issues = (issueData.issues || []).map((i: any) => ({
          ...i,
          requestType: "issue",
        }));

        const merged = [...events, ...issues].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setRequests(merged);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Helpers
  const formatDate = (date?: string) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: string) => {
    const key = status?.toLowerCase() || "pending";
    return statusConfig[key] || statusConfig.pending;
  };

  // Filter Logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      (req.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (req.issueType?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || req.requestType === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-5xl mx-auto min-h-screen pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">My Requests</h1>
            <p className="text-muted-foreground">
              Track and manage your event bookings and maintenance issues.
            </p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex bg-muted/50 p-1 rounded-lg w-full md:w-auto">
            {["all", "event", "issue"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  filterType === type
                    ? "bg-white dark:bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your history...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-dashed border-border rounded-2xl">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No requests found</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              {searchQuery
                ? "Try adjusting your search or filters."
                : "You haven't made any requests yet."}
            </p>
          </div>
        )}

        {/* List of Requests */}
        <div className="space-y-4">
          <AnimatePresence>
            {!isLoading &&
              filteredRequests.map((req, index) => {
                const statusData = getStatusStyle(req.status);
                const StatusIcon = statusData.icon;
                const isEvent = req.requestType === "event";

                return (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Icon & Info */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            isEvent
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                          }`}
                        >
                          {isEvent ? (
                            <FileText className="w-6 h-6" />
                          ) : (
                            <Wrench className="w-6 h-6" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-foreground">
                              {isEvent ? req.title : req.issueType}
                            </h3>
                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {isEvent ? "Event" : "Issue"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(req.createdAt)}
                            </span>
                            {isEvent && req.startTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {req.startTime} - {req.endTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status & Action */}
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusData.class}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusData.label}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(req)}
                          className="md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>

      {/* --- Details Modal / Overlay --- */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold font-display">
                    Request Details
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    ID: {selectedRequest._id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedRequest(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status Banner */}
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl ${
                    getStatusStyle(selectedRequest.status).class
                  }`}
                >
                  {(() => {
                    const StatusIcon = getStatusStyle(selectedRequest.status).icon;
                    return <StatusIcon className="w-5 h-5" />;
                  })()}
                  <div>
                    <p className="font-semibold text-sm uppercase tracking-wide">
                      Current Status
                    </p>
                    <p className="font-bold text-lg">
                      {getStatusStyle(selectedRequest.status).label}
                    </p>
                  </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Title / Type
                    </label>
                    <p className="text-lg font-medium">
                      {selectedRequest.requestType === "event"
                        ? selectedRequest.title
                        : selectedRequest.issueType}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Created On
                    </label>
                    <p className="text-sm">{formatDate(selectedRequest.createdAt)}</p>
                  </div>

                  {selectedRequest.requestType === "event" ? (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                          Event Date
                        </label>
                        <p className="text-sm">
                          {formatDate(selectedRequest.date)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                          Time
                        </label>
                        <p className="text-sm">
                          {selectedRequest.startTime} - {selectedRequest.endTime}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                          Participants
                        </label>
                        <p className="text-sm">
                          {selectedRequest.expectedParticipants}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                          Priority
                        </label>
                        <p className="text-sm capitalize">
                          {selectedRequest.priority || "Normal"}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                          Location
                        </label>
                        <p className="text-sm">
                          {selectedRequest.location || "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-muted/50 p-4 rounded-xl border border-border">
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">
                    Description / Purpose
                  </label>
                  <p className="text-sm leading-relaxed">
                    {selectedRequest.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
                <Button onClick={() => setSelectedRequest(null)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default MyRequestshistory;