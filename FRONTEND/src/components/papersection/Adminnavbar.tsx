import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, ArrowRight, LogOut, LayoutDashboard, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "@/components/LanguageSelector";
import { supabase } from "@/lib/supabase"; 

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // ADMIN SPECIFIC LINKS
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Archive", href: "/previousyearpaper" },
    { label: "Upload", href: "/uploadpaper" },
  ];

  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, y: -10 },
    open: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    closed: { x: -10, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      
      {/* Scroll Progress Bar (Emerald for Admin) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className={`container mx-auto px-4 transition-all duration-500 ${scrolled ? "pt-2" : "pt-6"}`}>
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`relative group flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-500 ${
            scrolled 
              ? "bg-background/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-emerald-500/20" 
              : "bg-transparent border-transparent"
          }`}
        >
          {scrolled && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}

          {/* Logo Section */}
          <Link to="/admindashboard" className="relative z-10 flex items-center gap-3 group/logo">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg overflow-hidden"
            >
              <Leaf className="w-6 h-6 text-white relative z-10" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/10 opacity-0 group-hover/logo:opacity-100 transition-opacity"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight leading-none text-slate-900">
                OptiCampus
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold opacity-0 group-hover/logo:opacity-100 transition-all transform translate-y-1 group-hover/logo:translate-y-0">
                Admin Mode
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Pill Style) */}
          <div className="hidden md:flex items-center gap-2 bg-secondary/30 p-1 rounded-full border border-border/40">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative px-5 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-emerald-700" : "text-muted-foreground hover:text-emerald-600"
                  }`}
                >
                  {(hoveredLink === link.label || isActive) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/50"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                     {link.label === "Admin Console" && <LayoutDashboard size={14} />}
                     {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="scale-90 hover:scale-100 transition-transform">
              <LanguageSelector />
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleLogout}
                className="relative group/btn overflow-hidden rounded-xl bg-slate-900 text-white px-6 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:bg-red-600 transition-colors"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Sign Out <LogOut className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover/btn:animate-shimmer" />
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden relative z-10">
            <LanguageSelector />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-secondary/50 rounded-xl border border-border"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="absolute top-full left-0 right-0 mt-4 p-4 bg-background/95 backdrop-blur-2xl rounded-3xl border border-primary/10 shadow-2xl md:hidden"
              >
                <div className="flex flex-col gap-2">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-600 border-b border-border/50 mb-2">
                    Admin Menu
                  </div>

                  {navLinks.map((link) => (
                    <motion.div variants={itemVariants} key={link.label}>
                        <Link
                          to={link.href}
                          className="flex items-center justify-between p-4 text-lg font-semibold rounded-2xl hover:bg-emerald-50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="flex items-center gap-3 text-slate-700">
                             {link.label === "Admin Console" && <LayoutDashboard size={18} className="text-emerald-600"/>}
                             {link.label}
                          </span>
                          <ArrowRight className="w-5 h-5 opacity-50" />
                        </Link>
                    </motion.div>
                  ))}
                  
                  <motion.div variants={itemVariants} className="mt-4 pt-4 border-t border-border">
                    <Button 
                        onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                        }}
                        className="w-full py-6 rounded-2xl bg-slate-900 text-white hover:bg-red-600 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            Sign Out <LogOut size={18} />
                        </span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </header>
  );
};

export default AdminNavbar;