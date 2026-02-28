import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  User as UserIcon, 
  Info, 
  CheckCircle, 
  XCircle, 
  Loader2 
} from "lucide-react";
import { baseUrl } from "@/App";

const FacultyEventRequests = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const facultyName = storedUser?.name || "Faculty / HOD";

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/staff/get-all-events`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch events");
      
      const fetchedEvents = data.events || [];
      setEvents(fetchedEvents);

      // Fetch names for all unique student IDs found in events
      const uniqueStudentIds = [...new Set(fetchedEvents.map((e: any) => e.studentId))];
      uniqueStudentIds.forEach((id: any) => {
        if (id) fetchStudentName(id);
      });

    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentName = async (userId: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/staff/get-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok && data.name) {
        setStudentNames(prev => ({ ...prev, [userId]: data.name }));
      }
    } catch (error) {
      console.error("Error fetching name for", userId, error);
    }
  };

  const handleStatusChange = async (eventId: string, status: "Approved" | "Rejected") => {
    setUpdatingId(eventId);
    try {
      const res = await fetch(`${baseUrl}/api/staff/event/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventId, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update status");

      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, status: status } : e))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update event status.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <DashboardLayout userRole="faculty" userName={facultyName}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Event Confirmation Requests</h2>
          <p className="text-muted-foreground">Review and manage student event venue bookings.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Fetching requests...</p>
          </div>
        ) : events.length === 0 ? (
          <Card className="p-10 text-center">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No requests found</h3>
            <p className="text-muted-foreground">There are currently no event requests to review.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event._id} className="overflow-hidden border-l-4 border-l-primary shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5" />
                        Requested by: 
                        <span className="font-medium text-foreground">
                          {studentNames[event.studentId] || "Loading..."}
                        </span>
                      </CardDescription>
                    </div>

                    <Badge
                      className="px-3 py-1 text-xs"
                      variant={
                        event.status === "Rejected"
                          ? "destructive"
                          : event.status === "Pending"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 text-sm bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">{event.startTime} – {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">{event.expectedParticipants} Participants</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold block mb-1">Purpose / Description:</span>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.description || event.purpose || "No description provided."}
                    </p>
                  </div>

                  {event.status === "Pending" && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        disabled={updatingId === event._id}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleStatusChange(event._id, "Approved")}
                      >
                        {updatingId === event._id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Approve
                      </Button>

                      <Button
                        disabled={updatingId === event._id}
                        variant="destructive"
                        onClick={() => handleStatusChange(event._id, "Rejected")}
                      >
                        {updatingId === event._id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyEventRequests;