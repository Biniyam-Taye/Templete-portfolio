import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Instagram, Twitter, ExternalLink, Mail, ArrowRight, FileText, Download } from 'lucide-react';

import { useCollection } from '../hooks/useCollection';

const GlowingLines = () => {
  // Reduced count for better performance without losing effect
  const paths = Array.from({ length: 8 }).map((_, i) => {
    const offset = i * 40; // Adjusted spacing to cover similar area with fewer lines
    return `M ${-450 + offset} 1200 Q ${-100 + offset} 600, ${300 + offset} 900 T ${800 + offset} 300 T ${1300 + offset} -100`;
  });

  return (
    <div className="glowing-lines-container" style={{ 
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1,
      opacity: 0.6, // Slightly reduced opacity for cleaner look
      transform: 'scale(1.4)',
      // Apply filter to the container instead of individual paths for massive performance boost
      // Using a simpler blur-based glow simulation if drop-shadow is still heavy
      filter: 'drop-shadow(0 0 10px var(--accent-primary))'
    }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="var(--accent-primary)"
            strokeWidth="5" // Slightly thinner to balance the "snake" look
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2], // Reduced max opacity
              x: [0, 60, 0], 
              y: [0, -30, 0],
              skewX: [-2, 2, -2] // Reduced skew processing
            }}
            transition={{ 
              duration: 18 + (i * 1.5), // Slower, smoother
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.2
            }}
            // Removed individual filter style here
          />
        ))}
      </svg>
    </div>
  );
};

const HeroSection = () => {
  const { data: homeData, loading } = useCollection('home');

  const [roleIndex, setRoleIndex] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [imageLoaded, setImageLoaded] = useState(false);

  // High-performance abstract placeholder
  const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000";

  // Dynamic Data Extraction
  const dynamicHome = (!loading && homeData?.[0]) ? homeData[0] : {
    title: "DIGITAL ARTISAN",
    roles: "USER EXPERIENCE & INTERFACE DESIGNER, CREATIVE DIRECTOR, BRAND STRATEGIST",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
  };

  // Ensure we display the long form even if DB has short form
  const rawRoles = dynamicHome.roles.replace(/UI\/UX DESIGNER/gi, "USER EXPERIENCE & INTERFACE DESIGNER");
  const roles = rawRoles.split(',').map(r => r.trim());

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [roles.length]);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 }); // Softer spring
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]); // Reduced tilt range
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const imageX = useTransform(mouseXSpring, [-0.5, 0.5], ["2%", "-2%"]);
  const imageY = useTransform(mouseYSpring, [-0.5, 0.5], ["2%", "-2%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Removed immediate null return for smooth skeleton transition
  // if (loading) return null; 

  return (
    <section 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className="hero-section"
      style={{ 
        position: 'relative', 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-color)',
        overflow: 'hidden',
        perspective: '2000px'
      }}
    >
      <GlowingLines />
      
      <div className="hero-grid-container" style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1400px',
        gap: '40px',
        zIndex: 3
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="hero-text-content"
          style={{ 
            flex: '1 1 600px',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div className="hero-badge" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div className="badge-line" style={{ width: '35px', height: '1.5px', background: 'var(--accent-primary)' }}></div>
            <span style={{ color: 'var(--accent-primary)', letterSpacing: '8px', fontSize: '0.75rem', fontWeight: 900 }}>PERSONAL BRAND & VISION</span>
          </div>

        {loading ? (
           <div className="skeleton" style={{ width: '300px', height: '80px', marginBottom: '20px', borderRadius: '8px' }}></div>
        ) : (
          <h1 style={{ 
            fontSize: 'clamp(3rem, 6vw, 5.5rem)', 
            margin: 0, 
            color: 'var(--text-primary)',
            fontFamily: "'Abril Fatface', serif",
            textTransform: 'uppercase',
            letterSpacing: '2px',
            lineHeight: 1.1,
            marginBottom: '20px',
            textShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'inline-block'
          }}>
            Dominique
          </h1>
        )}

        <div style={{ margin: '20px 0' }}>
          {loading ? (
             <div className="skeleton" style={{ width: '400px', height: '50px', borderRadius: '8px' }}></div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={roles[roleIndex]}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.4 }}
              >
                <h2 style={{ 
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
                    color: 'var(--accent-primary)',
                    margin: 0,
                    background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary), var(--accent-primary))',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shine 4s linear infinite',
                    letterSpacing: '2px'
                }}>
                  {roles[roleIndex]}
                </h2>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <div className="skeleton" style={{ width: '100%', height: '20px', borderRadius: '4px' }}></div>
            <div className="skeleton" style={{ width: '80%', height: '20px', borderRadius: '4px' }}></div>
          </div>
        ) : (
          <p style={{ 
            color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '420px',
            fontFamily: "'Inter', sans-serif, sans-serif", fontWeight: 300, marginTop: '10px'
          }}>
            {dynamicHome.desc || "A lifestyle dedicated to excellence, crafting sophisticated personal brands and impactful strategic visions for the next generation of leaders."}
          </p>
        )}

        <motion.div style={{ marginTop: '40px' }}>
             <a href="#portfolio" className="btn" style={{
                 padding: '14px 40px', border: '1.5px solid var(--text-primary)', color: 'var(--text-primary)',
                 textTransform: 'uppercase', fontFamily: "'Inter', sans-serif, sans-serif", fontSize: '0.85rem', fontWeight: 700, borderRadius: '4px',
                 letterSpacing: '2px', display: 'inline-flex', alignItems: 'center', gap: '12px',
                 transition: 'all 0.3s ease', background: 'transparent', textDecoration: 'none'
             }}>
                 EXPLORE JOURNEY <ArrowRight size={16} />
             </a>
        </motion.div>

      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="hero-image-wrapper"
        style={{ zIndex: 2, flex: '0 1 500px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1500px', marginRight: '40px' }}
      >
        <motion.div
           className="hero-portrait-card"
           style={{ 
             rotateX, rotateY, 
             transformStyle: 'preserve-3d', 
             width: '100%', height: '100%', 
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             willChange: 'transform' // Performance optimization hint
           }}
           animate={{ y: [0, -20, 0] }} // Reduced float distance
           transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        >
          <div style={{
            position: 'relative', width: 'min(480px, 100%)', height: 'min(620px, 75vh)',
            padding: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-color)',
            borderRadius: '24px', backdropFilter: 'blur(40px)',
            boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 107, 0, 0.05)', // Reduced shadow complexity
            display: 'flex', alignItems: 'center', justifyContent: 'center', transformStyle: 'preserve-3d'
          }}>
            <motion.div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', transform: 'translateZ(50px)', position: 'relative' }}>
              {(!imageLoaded || loading) && (
                <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}></div>
              )}
              <motion.img 
                src={dynamicHome.imageUrl} 
                alt="Portrait"
                onLoad={() => setImageLoaded(true)}
                style={{ 
                  width: '110%', height: '110%', 
                  objectFit: 'cover', 
                  opacity: imageLoaded && !loading ? 0.95 : 0, 
                  x: imageX, y: imageY, 
                  position: 'absolute', top: '-5%', left: '-5%',
                  transition: 'opacity 0.5s ease'
                }}
              />
              <motion.div 
                animate={{ y: [-600, 600] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', boxShadow: '0 0 20px var(--accent-primary)', zIndex: 2, opacity: 0.6 }}
              />
            </motion.div>
            <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(60px)', transform: 'translateZ(-40px)', zIndex: -1 }} />
          </div>
        </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes shine { to { background-position: 200% center; } }
        
        .hero-section {
          padding: 0 5% 0 120px !important;
        }

        @media (max-width: 1100px) {
          .hero-section { 
            padding: 120px 5% 60px !important; 
          }
          .hero-grid-container {
            flex-direction: column !important;
            gap: 60px !important;
          }
          .hero-text-content { 
            width: 100% !important; 
            flex: 1 1 auto !important; 
            text-align: center !important; 
            align-items: center !important;
          }
          .hero-badge { justify-content: center !important; }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            padding: 100px 20px 40px !important;
          }
          .hero-grid-container {
            gap: 0 !important;
          }
          h1 {
            font-size: clamp(2.5rem, 12vw, 4rem) !important;
          }
          .hero-image-wrapper {
            display: none !important;
            position: absolute !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
            overflow: hidden !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-section {
            padding: 80px 15px 30px !important;
          }
          .badge-line { display: none !important; }
          h1 { font-size: 2.2rem !important; }
          h2 { font-size: 1.4rem !important; }
          p { font-size: 0.9rem !important; }
          .btn { width: 100% !important; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
