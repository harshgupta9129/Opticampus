import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wrench, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Leaf, 
  Loader2, 
  Search 
} from "lucide-react";
import { baseUrl } from "@/App";

const getBadgeVariant = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === "success" || s === "resolved") return "default"; // Green/Primary
  if (s === "pending") return "outline"; // Gray/Border
  if (s === "rejected" || s === "failed") return "destructive"; // Red
  return "outline";
};

const FacultyMaintenanceStatus = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointsInput, setPointsInput] = useState<Record<string, string>>({});
  const [givingPointsId, setGivingPointsId] = useState<string | null>(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const facultyName = storedUser?.name || "Faculty / HOD";

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/maintenance/get-all-issues`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch issues");
      
      // Sorting issues: Pending ones first
      const sortedIssues = (data.issues || []).sort((a: any, b: any) => {
        if (a.status === "Pending" && b.status !== "Pending") return -1;
        if (a.status !== "Pending" && b.status === "Pending") return 1;
        return 0;
      });

      setIssues(sortedIssues);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleGivePoints = async (issueId: string) => {
    const points = pointsInput[issueId];
    if (!points || Number(points) <= 0) {
      alert("Please enter a valid number of points.");
      return;
    }

    try {
      setGivingPointsId(issueId);
      const res = await fetch(`${baseUrl}/api/staff/give-green-point`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          issueId,
          points: Number(points),
        }),
      });

      if (res.ok) {
        setIssues((prev) =>
          prev.map((e) =>
            e._id === issueId ? { ...e, pointsGiven: true } : e
          )
        );
      } else {
        const data = await res.json();
        alert(data.message || "Failed to assign points");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGivingPointsId(null);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setPointsInput((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <DashboardLayout userRole="faculty" userName={facultyName}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Maintenance Status</h2>
            <p className="text-muted-foreground">Monitor infrastructure health and reward reporting.</p>
          </div>
          <Button onClick={fetchIssues} variant="outline" size="sm" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
            Refresh List
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-card border rounded-2xl">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Loading maintenance reports...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No issues found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              There are currently no reported maintenance requests in your department.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {issues.map((issue) => (
              <Card key={issue._id} className="overflow-hidden border-l-4 border-l-primary shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Left Side: Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getBadgeVariant(issue.status)}>
                          {issue.status === "Success" ? "Resolved" : issue.status}
                        </Badge>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {issue.issueType}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold leading-none mb-2">{issue.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {issue.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                          <Wrench className="w-3 h-3" /> 
                          Reported: {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Points Action */}
                    <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                      {issue.pointsGiven ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full border border-green-100">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Points Awarded</span>
                        </div>
                      ) : (
                        <div className="space-y-3 w-full">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase text-center md:text-left">Reward Student</p>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Leaf className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-green-600" />
                              <Input
                                type="number"
                                placeholder="Points"
                                className="pl-8 h-9 text-sm"
                                value={pointsInput[issue._id] || ""}
                                onChange={(e) => handleInputChange(issue._id, e.target.value)}
                              />
                            </div>
                            <Button 
                              size="sm" 
                              className="h-9 px-4"
                              onClick={() => handleGivePoints(issue._id)}
                              disabled={givingPointsId === issue._id}
                            >
                              {givingPointsId === issue._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "Give"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyMaintenanceStatus;