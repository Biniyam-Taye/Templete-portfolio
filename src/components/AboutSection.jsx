import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useCollection } from '../hooks/useCollection';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AboutSection = () => {
  const { data: aboutData, loading } = useCollection('about');
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);

  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // High-performance abstract placeholder
  const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000";

  // Dynamic Data Extraction
  const dynamicAbout = (!loading && aboutData?.[0]) ? aboutData[0] : {
    desc: "I am a digital architect specializing in high-performance web systems and AI-driven logic. My approach blends cinematic aesthetics with rigorous engineering to create interfaces that don't just work—they inspire.",
    imageUrl: DEFAULT_PLACEHOLDER,
    gallery: [],
    stats: "5+ YEARS, 40+ BUILDS, 99% UPTIME"
  };

  const images = [dynamicAbout.imageUrl, ...(dynamicAbout.gallery || [])].filter(Boolean);

  useEffect(() => {
    if (images.length <= 1 || isHovering) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length, isHovering]);

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const statItems = dynamicAbout.stats.split(',').map(s => {
      const parts = s.trim().split(' ');
      return { 
          value: parts[0], 
          label: parts.slice(1).join(' ') 
      };
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Removed immediate null return for smooth skeleton transition
  // if (loading) return null;

  return (
    <section id="about" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ 
      position: 'relative', 
      padding: '120px 10%', 
      display: 'grid', 
      gridTemplateColumns: '1fr 1.2fr', 
      alignItems: 'center', 
      gap: '80px',
      overflow: 'hidden',
      background: 'var(--bg-color)',
      transition: 'background 0.5s ease' 
    }}>
      {/* 3D Frame Container */}
      <div style={{ perspective: '1000px', display: 'flex', justifyContent: 'center' }}>
        <motion.div
           style={{ rotateX, rotateY, transformStyle: 'preserve-3d', position: 'relative' }}
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ duration: 1, ease: 'easeOut' }}
           viewport={{ once: true }}
        >
          {/* Main Floating Frame */}
          <div style={{
            width: '380px', height: '480px', background: 'var(--card-bg)', backdropFilter: 'var(--glass-blur)',
            borderRadius: '40px', border: '1px solid var(--border-color)', padding: '24px',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', inset: '12px', border: '1px solid rgba(255, 107, 0, 0.3)', borderRadius: '32px', pointerEvents: 'none', zIndex: 1 }}></div>
            <div 
              style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', background: '#0a0a0a', position: 'relative' }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <AnimatePresence mode='wait'>
                {(!imageLoaded || loading) && (
                  <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}></div>
                )}
                <motion.img 
                  key={currentImageIndex}
                  src={images[currentImageIndex]} 
                  alt="About" 
                  onLoad={() => setImageLoaded(true)}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: (imageLoaded && !loading) ? 0.9 : 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} 
                />
              </AnimatePresence>
              
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 40%)' }}></div>

              {/* Navigation Controls */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    style={{
                      position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                      width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                      opacity: isHovering ? 1 : 0, transition: 'opacity 0.3s'
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={nextImage}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
                      opacity: isHovering ? 1 : 0, transition: 'opacity 0.3s'
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div style={{ position: 'absolute', bottom: '15px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }}>
                    {images.map((_, idx) => (
                      <div 
                        key={idx}
                        style={{ 
                          width: idx === currentImageIndex ? '16px' : '4px', 
                          height: '4px', 
                          borderRadius: '2px', 
                          background: idx === currentImageIndex ? 'var(--accent-primary)' : 'rgba(255,255,255,0.3)',
                          transition: 'all 0.3s'
                        }} 
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div style={{ position: 'absolute', top: 35, left: 35, width: 20, height: 2, background: 'rgba(255,255,255,0.4)', zIndex: 2 }}></div>
            <div style={{ position: 'absolute', top: 35, left: 35, width: 2, height: 20, background: 'rgba(255,255,255,0.4)', zIndex: 2 }}></div>
          </div>
          <motion.div style={{ position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%', background: 'var(--accent-primary)', filter: 'blur(100px)', opacity: 0.1, zIndex: -1, borderRadius: '40px' }} />
        </motion.div>
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '4px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '16px' }}>Discovery</span>
        <h2 className="section-title-premium" style={{ justifyContent: 'flex-start', marginBottom: '32px' }}>
          <span className="section-title-accent">ABOUT</span> 
          <span className="section-title-stroke">ME</span>
        </h2>
        
        <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '600px' }}>
          {loading ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="skeleton" style={{ width: '100%', height: '20px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '90%', height: '20px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '95%', height: '20px', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '60%', height: '20px', borderRadius: '4px' }}></div>
             </div>
          ) : dynamicAbout.desc.split('\n\n').map((p, i) => (
            <p key={i} style={{ 
              marginBottom: i === 0 ? '24px' : '0px',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 400,
              fontSize: '1.05rem',
              letterSpacing: '0.2px'
            }}>
              {p}
            </p>
          ))}
        </div>

        {/* Stats or Highlights */}
        <div style={{ display: 'flex', gap: '40px', marginTop: '48px' }}>
            {statItems.map((item, idx) => (
              <div key={idx}>
                <div style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 700, 
                  color: 'white', 
                  fontFamily: "'Oswald', sans-serif",
                  lineHeight: 1,
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 700, marginTop: '4px' }}>{item.label}</div>
              </div>
            ))}
        </div>
      </motion.div>

      <div style={{ position: 'absolute', bottom: '-100px', left: '50%', transform: 'translateX(-50%)', width: '50%', height: '200px', background: 'rgba(255, 107, 0, 0.1)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
      
      <style>{`
        @media (max-width: 1024px) {
          #about {
            grid-template-columns: 1fr !important;
            padding: 80px 5% !important;
            gap: 50px !important;
          }
        }
        
        @media (max-width: 768px) {
          #about {
            display: flex !important;
            flex-direction: column !important;
            padding: 60px 20px !important;
            gap: 40px !important;
          }
          
          /* Move image container to the top */
          #about > div:first-child {
            order: 1 !important;
          }
          
          /* Move content to the bottom */
          #about > div:nth-child(2) {
            order: 2 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
