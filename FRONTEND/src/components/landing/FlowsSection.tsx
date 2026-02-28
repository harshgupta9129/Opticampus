import { motion } from "framer-motion";
import { 
  CalendarPlus, 
  CheckCircle2, 
  QrCode, 
  Bell,
  User,
  Users,
  UserCheck,
  Shield,
  ScanLine,
  Wrench,
  Award,
  ArrowRight
} from "lucide-react";

const flows = [
  {
    title: "Event & Class Management",
    subtitle: "Smart Scheduling Flow",
    color: "from-primary to-primary/70",
    steps: [
      { icon: User, label: "Student Login", desc: "Secure authentication" },
      { icon: CalendarPlus, label: "Create Request", desc: "Event details & capacity" },
      { icon: CheckCircle2, label: "Smart Suggestion", desc: "Energy-efficient room" },
      { icon: QrCode, label: "Get QR Pass", desc: "After approval" },
    ],
  },
  {
    title: "Paperless Approval System",
    subtitle: "Digital Workflow Chain",
    color: "from-info to-info/70",
    steps: [
      { icon: User, label: "Student Request", desc: "Submit digitally" },
      { icon: Users, label: "Faculty Review", desc: "Approve/Comment" },
      { icon: UserCheck, label: "HOD Approval", desc: "Final academic check" },
      { icon: Shield, label: "Admin Confirm", desc: "Resource allocation" },
    ],
  },
  {
    title: "Snap & Fix Maintenance",
    subtitle: "QR-Based Reporting",
    color: "from-warning to-warning/70",
    steps: [
      { icon: ScanLine, label: "Scan Room QR", desc: "In room/washroom" },
      { icon: Wrench, label: "Select Issue", desc: "Light, AC, water..." },
      { icon: Bell, label: "Auto-Assign", desc: "Notify maintenance" },
      { icon: Award, label: "Earn Points", desc: "Green rewards" },
    ],
  },
];

const FlowsSection = () => {
  return (
    <section id="flows" className="py-24 gradient-hero-bg relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Three Core <span className="gradient-text">Workflows</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Streamlined processes that connect students, faculty, and maintenance 
            teams in a unified sustainable ecosystem.
          </p>
        </motion.div>

        {/* Flows */}
        <div className="space-y-12">
          {flows.map((flow, flowIndex) => (
            <motion.div
              key={flow.title}
              initial={{ opacity: 0, x: flowIndex % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: flowIndex * 0.2 }}
              className="bg-card border border-border rounded-3xl p-8 shadow-elegant"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Flow header */}
                <div className="lg:w-1/4">
                  <div className={`inline-block bg-gradient-to-r ${flow.color} text-white text-xs font-semibold px-3 py-1 rounded-full mb-3`}>
                    {flow.subtitle}
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    {flow.title}
                  </h3>
                </div>

                {/* Flow steps */}
                <div className="lg:w-3/4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {flow.steps.map((step, stepIndex) => (
                      <div key={step.label} className="relative">
                        <div className="bg-background border border-border rounded-xl p-4 text-center h-full">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${flow.color} flex items-center justify-center mx-auto mb-3`}>
                            <step.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="font-semibold text-sm mb-1">{step.label}</div>
                          <div className="text-xs text-muted-foreground">{step.desc}</div>
                        </div>
                        {stepIndex < flow.steps.length - 1 && (
                          <div className="hidden md:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlowsSection;
