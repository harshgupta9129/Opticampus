import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ScanLine,
  Wrench,
  Lightbulb,
  Droplets,
  Wind,
  Plug,
  CheckCircle2,
  Leaf,
  QrCode,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { baseUrl } from "@/App";

const issueTypes = [
  { id: "light", label: "Lighting Issue", icon: Lightbulb },
  { id: "ac", label: "AC Problem", icon: Wind },
  { id: "water", label: "Water Leak", icon: Droplets },
  { id: "electrical", label: "Electrical", icon: Plug },
  { id: "other", label: "Other", icon: Wrench },
];

const MaintenanceReportPage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.name || "Student";
  
  const [step, setStep] = useState<"form" | "success">("form");
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      issueType: selectedIssue,
      description,
    };

    console.log(formData);

    try {
      // dummy API for now
      const res = await fetch(`${baseUrl}/api/student/create-issue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit issue");
      console.log(res);

      alert("Issue submitted successfully");
      setStep("success");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout userRole="student" userName={userName}>
      <div className="max-w-2xl mx-auto">
        {step === "form" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold mb-2">
                Report an Issue
              </h2>
              <p className="text-muted-foreground mb-6">
                Select the type of issue and provide details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Issue Type</Label>
                  <RadioGroup
                    value={selectedIssue}
                    onValueChange={setSelectedIssue}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    {issueTypes.map((issue) => (
                      <Label
                        key={issue.id}
                        htmlFor={issue.id}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedIssue === issue.id
                            ? "border-warning bg-warning/5"
                            : "border-border hover:border-warning/30"
                        }`}
                      >
                        <RadioGroupItem
                          value={issue.id}
                          id={issue.id}
                          className="sr-only"
                        />
                        <issue.icon
                          className={`w-6 h-6 ${selectedIssue === issue.id ? "text-warning" : "text-muted-foreground"}`}
                        />
                        <span
                          className={`text-sm font-medium text-center ${selectedIssue === issue.id ? "text-warning" : ""}`}
                        >
                          {issue.label}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description (Location, Issue Explaination)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional details about the issue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setStep("form")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="flex-1"
                    disabled={!selectedIssue}
                  >
                    Submit Report
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Issue Reported!
              </h2>
              <p className="text-muted-foreground mb-6">
                The maintenance team has been notified and will address the
                issue shortly.
              </p>

              <Button
                variant="hero"
                size="lg"
                onClick={() => setStep("form")}
                className="w-full"
              >
                Report Another Issue
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceReportPage;
