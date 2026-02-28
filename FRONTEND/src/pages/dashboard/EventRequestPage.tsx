import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Briefcase,
  PartyPopper,
  Wrench,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { baseUrl } from "@/App";

// Steps configuration
const STEPS = [
  { num: 1, label: "Event Details" },
  { num: 2, label: "Confirmation" },
];

const EventRequestPage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.name || "Student";

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    participants: "",
    purpose: "class",
  });

  const validateForm = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time.");
      return false;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Event date cannot be in the past.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/student/create-event`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          expectedParticipants: Number(formData.participants),
          purpose: formData.purpose,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      console.log("Success:", data);
      setStep(2); // Move to success step
    } catch (error: any) {
      console.error("Event request failed:", error.message);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const purposeOptions = [
    { id: "class", label: "Class", icon: BookOpen },
    { id: "meeting", label: "Meeting", icon: Briefcase },
    { id: "event", label: "Event", icon: PartyPopper },
    { id: "workshop", label: "Workshop", icon: Wrench },
  ];

  return (
    <DashboardLayout userRole="student" userName={userName}>
      {/* Progress Steps Indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-4">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex items-center gap-3 transition-colors duration-300 ${
                  step >= s.num ? "text-primary" : "text-muted-foreground/50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    step >= s.num
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-background border-muted text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.num}
                </div>
                <span className="font-semibold hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                    step > s.num ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  Event Details
                </h2>
                <p className="text-muted-foreground">
                  Fill in the details below to request a venue for your activity.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title & Description */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Annual Tech Fest Planning"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="h-12 text-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Briefly describe the agenda or activities..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-border/50" />

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10 h-11"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="participants">Expected Participants</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="participants"
                        type="number"
                        placeholder="e.g. 45"
                        className="pl-10 h-11"
                        min="1"
                        value={formData.participants}
                        onChange={(e) =>
                          setFormData({ ...formData, participants: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="startTime"
                        type="time"
                        className="pl-10 h-11"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({ ...formData, startTime: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="endTime"
                        type="time"
                        className="pl-10 h-11"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-border/50" />

                {/* Purpose Selection */}
                <div className="space-y-4">
                  <Label className="text-base">Event Type</Label>
                  <RadioGroup
                    value={formData.purpose}
                    onValueChange={(value) =>
                      setFormData({ ...formData, purpose: value })
                    }
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {purposeOptions.map((type) => (
                      <div key={type.id} className="relative">
                        <RadioGroupItem
                          value={type.id}
                          id={type.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type.id}
                          className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-border bg-card hover:bg-accent/50 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
                        >
                          <type.icon className={`w-6 h-6 mb-2 ${formData.purpose === type.id ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="font-medium text-sm">{type.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Error Message Display */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                {/* Action Button */}
                <Button 
                  type="submit" 
                  variant="default" // Changed from 'hero' to standard 'default' if 'hero' isn't defined
                  size="lg" 
                  className="w-full text-base h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Submit Request <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="bg-card border border-border rounded-2xl p-10 shadow-lg">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="font-display text-3xl font-bold mb-3">
                Request Sent!
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Your event request has been submitted to the admin for approval. 
                You will be notified via email once the status changes.
              </p>

              <div className="bg-muted/50 rounded-xl p-6 mb-8 text-left border border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Request Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event:</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{formData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {formData.startTime} - {formData.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{formData.purpose}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setFormData({ ...formData, title: "", description: "", date: "", startTime: "", endTime: "" });
                  setStep(1);
                }}
                className="w-full"
              >
                Create Another Request
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default EventRequestPage;