import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Leaf,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  GraduationCap,
  Shield,
  Wrench,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "@/App";

const roles = [
  { id: "student", label: "Student", icon: GraduationCap, desc: "Request events & report issues" },
  { id: "faculty", label: "Faculty / HOD", icon: User, desc: "Approve requests & manage classes" },
  { id: "maintenance", label: "Maintenance", icon: Wrench, desc: "Handle repair tickets" },
];

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [isLoading, setIsLoading] = useState(false);

  // ✅ ONLY OTP REDIRECT REMOVED — NOTHING ELSE CHANGED
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.role) {
      alert("Please select a role");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // ✅ DIRECT LOGIN (NO OTP PAGE)
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      // ✅ Redirect straight to dashboard
      navigate(`/dashboard/${data.role}`);
    } catch (error) {
      alert("Backend server not running");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero-bg flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-white">OptiCampus</span>
          </Link>

          <h1 className="font-display text-4xl font-bold text-white mb-4">
            Join the Sustainable Campus Movement
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Create your account to start managing resources efficiently and
            contribute to a greener campus environment.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { icon: GraduationCap, label: "Book Rooms" },
              { icon: Shield, label: "Digital Approvals" },
              { icon: Wrench, label: "Report Issues" },
              { icon: Leaf, label: "Earn Green Points" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
              >
                <item.icon className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="font-display text-2xl font-bold">OptiCampus</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
            <h2 className="font-display text-2xl font-bold mb-2">Create Account</h2>
            <p className="text-muted-foreground mb-6">
              Choose your role and get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label>Select Your Role</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                  className="grid grid-cols-2 gap-3"
                >
                  {roles.map((role) => (
                    <Label
                      key={role.id}
                      htmlFor={role.id}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.role === role.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <RadioGroupItem value={role.id} id={role.id} className="sr-only" />
                      <role.icon
                        className={`w-6 h-6 ${
                          formData.role === role.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          formData.role === role.id
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {role.label}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-12"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder=""
                    className="pl-10 h-12"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-12"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
