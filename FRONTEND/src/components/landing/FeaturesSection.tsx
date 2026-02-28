import { motion } from "framer-motion";
import { 
  Calendar, 
  FileCheck, 
  Wrench, 
  QrCode, 
  BarChart3, 
  Users, 
  Leaf,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Event Scheduling",
    description: "AI-powered room suggestions based on energy efficiency, building activity, and capacity optimization.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FileCheck,
    title: "Paperless Approvals",
    description: "Complete digital workflow from Student → Faculty → HOD → Admin with instant notifications.",
    color: "bg-info/10 text-info",
  },
  {
    icon: Wrench,
    title: "Snap & Fix Maintenance",
    description: "QR-based issue reporting with real-time ticket tracking and automated team assignments.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: QrCode,
    title: "QR Gate Passes",
    description: "Auto-generated digital passes for approved events with instant verification capabilities.",
    color: "bg-success/10 text-success",
  },
  {
    icon: BarChart3,
    title: "Sustainability Analytics",
    description: "Real-time dashboards showing energy savings, paper reduction, and maintenance metrics.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Dedicated interfaces for Students, Faculty, Admins, and Maintenance teams.",
    color: "bg-info/10 text-info",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent-foreground">Powerful Features</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything You Need for a{" "}
            <span className="gradient-text">Greener Campus</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A complete ecosystem for intelligent campus resource management, 
            from event booking to maintenance operations.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-card border border-border rounded-2xl p-6 card-hover">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-full px-6 py-3">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              Join the movement toward sustainable campus operations
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
