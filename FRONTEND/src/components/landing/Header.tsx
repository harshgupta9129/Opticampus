// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Leaf, Menu, X } from "lucide-react";
// import { Link } from "react-router-dom";
// import LanguageSelector from "@/components/LanguageSelector";


// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const navLinks = [
//     { label: "Features", href: "#features" },
//     { label: "Workflows", href: "#flows" },
//     { label: "About", href: "#about" },
//   ];

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50">
//       <div className="mx-4 mt-4">
//         <motion.nav
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="glass-card rounded-2xl px-6 py-4"
//         >
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-2">
//               <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
//                 <Leaf className="w-6 h-6 text-white" />
//               </div>
//               <span className="font-display text-xl font-bold">OptiCampus</span>
//             </Link>

//             {/* Desktop navigation */}
//             <div className="hidden md:flex items-center gap-8">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.label}
//                   href={link.href}
//                   className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   {link.label}
//                 </a>
//               ))}
//             </div>

//             {/* Desktop CTA */}
//             {/* <div className="hidden md:flex items-center gap-3">
//               <Button variant="ghost" asChild>
//                 <Link to="/login">Sign In</Link>
//               </Button>
//               <Button variant="default" asChild>
//                 <Link to="/register">Get Started</Link>
//               </Button>
//             </div> */}

//             <div className="hidden md:flex items-center gap-3">

//             <LanguageSelector />

//             <Button variant="ghost" asChild>
//               <Link to="/login">Sign In</Link>
//             </Button>

//             <Button variant="default" asChild>
//               <Link to="/register">Get Started</Link>
//             </Button>

//             </div>




//             {/* Mobile menu button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </Button>
//           </div>

//           {/* Mobile menu */}
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="md:hidden mt-4 pt-4 border-t border-border"
//               >
//                 <div className="flex flex-col gap-4">
//                   {navLinks.map((link) => (
//                     <a
//                       key={link.label}
//                       href={link.href}
//                       className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {link.label}
//                     </a>
//                   ))}
//                   <div className="flex flex-col gap-2 pt-4 border-t border-border">
//                     <Button variant="ghost" asChild>
//                       <Link to="/login">Sign In</Link>
//                     </Button>
//                     <Button variant="default" asChild>
//                       <Link to="/register">Get Started</Link>
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.nav>
//       </div>
//     </header>
//   );
// };

// export default Header;





import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "@/components/LanguageSelector";
import { Variants } from "framer-motion";

const Header = () => {
  

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

 
  useEffect(() => {
  
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
       
        setTimeout(() => {
          const yOffset = -100; 
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    } else if (location.pathname === "/") {
    
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Workflows", href: "#flows" },
    { label: "About", href: "#about" },
    { label: "Archive", href: "/previousyearpaper", isStatic: true },
  ];

  const isHomePage = location.pathname === "/";

  const navVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

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
 
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-primary origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className={`container mx-auto px-4 transition-all duration-500 ${scrolled ? "pt-2" : "pt-6"}`}>
        <motion.nav
          variants={navVariants}
          initial="hidden"
          animate="visible"
          className={`relative group flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-500 ${
            scrolled 
              ? "bg-background/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-primary/20" 
              : "bg-transparent border-transparent"
          }`}
        >
         
          {scrolled && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}

         
          <Link to="/" className="relative z-10 flex items-center gap-3 group/logo">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              className="relative w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shadow-lg overflow-hidden"
            >
              <Leaf className="w-6 h-6 text-white relative z-10" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/10 opacity-0 group-hover/logo:opacity-100 transition-opacity"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight leading-none">
                OptiCampus
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold opacity-0 group-hover/logo:opacity-100 transition-all transform translate-y-1 group-hover/logo:translate-y-0">
                Eco-System
              </span>
            </div>
          </Link>

   
          <div className="hidden md:flex items-center gap-2 bg-secondary/30 p-1 rounded-full border border-border/40">
            {navLinks.map((link) => {
              const href = link.isStatic ? link.href : (isHomePage ? link.href : `/${link.href}`);
              return (
                <a
                  key={link.label}
                  href={href}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-5 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {hoveredLink === link.label && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/50"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

         
          <div className="hidden md:flex items-center gap-4">
            <div className="scale-90 hover:scale-100 transition-transform">
              <LanguageSelector />
            </div>
            
            <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="font-medium" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button className="relative group/btn overflow-hidden rounded-xl bg-primary px-6 shadow-[0_0_20px_rgba(var(--primary),0.3)]" asChild>
                <Link to="/register">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started <Sparkles className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover/btn:animate-shimmer" />
                </Link>
              </Button>
            </motion.div>
          </div>

         
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
                  {navLinks.map((link) => (
                    <motion.a
                      variants={itemVariants}
                      key={link.label}
                      href={link.isStatic ? link.href : (isHomePage ? link.href : `/${link.href}`)}
                      className="flex items-center justify-between p-4 text-lg font-semibold rounded-2xl hover:bg-primary/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                      <ArrowRight className="w-5 h-5 opacity-50" />
                    </motion.a>
                  ))}
                  
                  <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <Button variant="outline" className="py-6 rounded-2xl" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button className="py-6 rounded-2xl" asChild>
                      <Link to="/register">Join Now</Link>
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

export default Header;