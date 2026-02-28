import { Leaf, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="about" className="bg-sidebar text-sidebar-foreground py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">OptiCampus</span>
            </Link>
            <p className="text-sm text-sidebar-foreground/70 mb-6">
              Smart resource & event orchestration for sustainable campus operations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sidebar-foreground/50 hover:text-sidebar-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/50 hover:text-sidebar-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/50 hover:text-sidebar-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li><a href="#features" className="hover:text-sidebar-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-sidebar-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-sidebar-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-sidebar-foreground/50">
          <p>© {new Date().getFullYear()} OptiCampus. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sidebar-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
