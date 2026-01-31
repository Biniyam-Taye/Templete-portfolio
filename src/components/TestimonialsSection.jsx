import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCollection } from '../hooks/useCollection';

const staticTestimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Product Manager",
    company: "Google",
    text: "Working with this developer was a game-changer for our project. Their ability to bridge the gap between complex backend logic and stunning UI is rare.",
    avatarColor: "#ff6b00"
  },
  {
    id: 2,
    name: "Marcus Thorne",
    role: "CTO",
    company: "Fintech Solutions",
    text: "The architectural depth and attention to detail provided exceeded our expectations. A highly professional engineer who delivers real value.",
    avatarColor: "#ff9e00"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Lead UI/UX Designer",
    company: "Creative Pulse",
    text: "Rarely do I see a developer implement my designs with such precision. The micro-interactions and animations are absolutely world-class.",
    avatarColor: "#8b5cf6"
  }
];

const TestimonialsSection = () => {
  const { data: dbTestimonials, loading } = useCollection('testimonials');
  const [index, setIndex] = useState(0);

  const testimonialsData = dbTestimonials.length > 0 ? dbTestimonials.map(t => ({
    ...t,
    text: t.quote || t.text,
    avatarColor: t.avatarColor || ['#ff6b00', '#ff9e00', '#8b5cf6', '#ffcc00'][Math.floor(Math.random() * 4)]
  })) : staticTestimonials;

  useEffect(() => {
    if (testimonialsData.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonialsData.length]);

  if (loading) return null;

  const next = () => setIndex((prev) => (prev + 1) % testimonialsData.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);

  return (
    <section id="testimonials" className="testimonials-section" style={{
      position: 'relative',
      padding: '60px 0',
      background: 'var(--bg-color)',
      overflow: 'hidden',
      minHeight: '700px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.5s ease'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, var(--accent-primary)08 0%, transparent 60%)',
        zIndex: 0
      }} />

      {/* Grid Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.2,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', marginBottom: '50px', zIndex: 2, position: 'relative' }}
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-40px', left: '50%', marginLeft: '-320px', opacity: 0.1 }}>
          <Quote size={80} color="var(--accent-primary)" style={{ transform: 'scaleX(-1)' }} />
        </motion.div>

        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '20px', right: '50%', marginRight: '-320px', opacity: 0.1 }}>
          <Quote size={60} color="var(--accent-secondary)" />
        </motion.div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 28px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderRadius: '100px',
          border: '1px solid var(--accent-primary)',
          marginBottom: '30px',
          boxShadow: '0 0 20px var(--accent-primary)22'
        }}>
          <MessageSquare size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>Voice of Clients</span>
        </div>
        <h2 className="section-title-premium">
          <span className="section-title-accent">STORIES</span> OF <span className="section-title-stroke">SUCCESS</span>
        </h2>
      </motion.div>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        height: '550px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '2000px',
        zIndex: 2
      }}>
        {testimonialsData.map((test, i) => {
          let position = i - index;
          if (position < -1) position += testimonialsData.length;
          if (position > 1) position -= testimonialsData.length;

          const isActive = position === 0;
          const isLeft = position === -1;
          const isRight = position === 1;
          const isFar = !isActive && !isLeft && !isRight;

          return (
            <motion.div
              key={test.id}
              className={`testimonial-wrapper ${isActive ? 'active' : ''}`}
              animate={{
                x: isActive ? 0 : isLeft ? -700 : isRight ? 700 : 0,
                y: isActive ? 0 : 40,
                z: isActive ? 0 : -300,
                rotateY: isLeft ? 35 : isRight ? -35 : 0,
                scale: isActive ? 1.15 : 0.8,
                opacity: isFar ? 0 : isActive ? 1 : 0.4,
                zIndex: isActive ? 10 : 5,
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 20
              }}
              style={{
                position: 'absolute',
                width: '680px',
                height: '380px',
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <div
                className="testimonial-card"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--card-bg)',
                  backdropFilter: 'var(--glass-blur)',
                  borderRadius: '40px',
                  border: `1.5px solid ${isActive ? 'var(--accent-primary)33' : 'var(--border-color)'}`,
                  padding: '60px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: isActive ? '0 30px 60px rgba(0,0,0,0.1)' : 'none',
                  transition: 'background 0.5s ease, border 0.5s ease'
                }}>
                <div
                  className="quote-icon"
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '20px',
                    width: '70px',
                    height: '70px',
                    background: `linear-gradient(135deg, ${test.avatarColor}, var(--accent-secondary))`,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 10px 30px ${test.avatarColor}44`,
                    zIndex: 2
                  }}>
                  <Quote size={35} color="var(--bg-color)" fill="var(--bg-color)" />
                </div>

                <p
                  className="testimonial-text"
                  style={{
                    fontSize: '1.35rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.8,
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.9,
                    marginBottom: '30px',
                    textAlign: 'center',
                    width: '100%',
                    padding: '0 10%',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  "{test.text}"
                </p>

                <div
                  className="star-rating"
                  style={{ display: 'flex', gap: '4px', marginBottom: '20px', color: test.avatarColor, justifyContent: 'center' }}>
                  {[...Array(5)].map((_, it) => <Star key={it} size={14} fill={test.avatarColor} />)}
                </div>

                <div
                  className="testimonial-author"
                  style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, ${test.avatarColor}, transparent)`,
                    padding: '2px'
                  }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: test.avatarColor }}>
                      {test.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.1rem', margin: 0, fontFamily: "'Abril Fatface', serif", textTransform: 'uppercase', letterSpacing: '1px' }}>{test.name}</h4>
                    {test.role && (
                      <span style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        display: 'block',
                        marginTop: '2px',
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif"
                      }}
                      >
                        {test.role} {test.company ? `@ ${test.company}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="testimonial-nav" style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '80px', zIndex: 3 }}>
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            opacity: 0.5
          }}
        >
          <ChevronLeft size={40} />
        </motion.button>

        <div className="testimonial-dots" style={{ display: 'flex', gap: '15px' }}>
          {testimonialsData.map((_, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i === index ? 'var(--accent-primary)' : 'var(--border-color)',
                transform: i === index ? 'scale(1.4)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: i === index ? `0 0 15px var(--accent-primary)` : 'none'
              }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            opacity: 0.5
          }}
        >
          <ChevronRight size={40} />
        </motion.button>
      </div>

      <style>{`
        @media (max-width: 768px) {
            #testimonials { 
                padding: 100px 0 !important; 
                min-height: auto !important; 
            }
            .section-title-premium {
                font-size: 2rem !important;
                margin-bottom: 60px !important;
                padding: 0 20px !important;
            }
            .testimonial-wrapper {
                width: 100% !important;
                max-width: 680px !important;
                height: auto !important;
                position: relative !important;
                display: none !important;
            }
            .testimonial-wrapper.active {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
            }
            div[style*="perspective"] {
                height: auto !important;
                perspective: none !important;
                display: block !important;
                width: 100% !important;
                padding: 0 20px !important;
            }
            .testimonial-card { 
                padding: 60px 20px 40px !important; 
                text-align: center !important;
                align-items: center !important; 
                border-radius: 30px !important;
                background: var(--card-bg) !important;
                border: 1px solid var(--border-color) !important;
                height: auto !important;
                width: 100% !important;
                display: flex !important;
                box-sizing: border-box !important;
                box-shadow: 0 20px 40px rgba(0,0,0,0.05) !important;
            }
            .quote-icon { 
                width: 65px !important; 
                height: 65px !important; 
                left: 0 !important;
                top: -32.5px !important; 
                transform: none !important;
                border-radius: 18px !important;
            }
            .testimonial-text { 
                font-size: 1.15rem !important; 
                line-height: 1.7 !important;
                text-align: center !important;
                margin-bottom: 30px !important;
                width: 100% !important;
                padding: 0 5% !important;
                color: var(--text-primary) !important;
            }
            .star-rating {
                margin-bottom: 20px !important;
                justify-content: center !important;
                display: flex !important;
                width: auto !important;
            }
            .testimonial-author {
                flex-direction: column !important;
                gap: 15px !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                margin-top: 10px !important;
                padding-top: 0 !important;
                border-top: none !important;
            }
            .testimonial-nav {
                margin-top: 50px !important;
                gap: 30px !important;
            }
        }
        @media (max-width: 480px) {
            .section-title-premium { font-size: 1.8rem !important; }
            .testimonial-card { padding: 50px 15px 30px !important; }
            .testimonial-text { font-size: 1.05rem !important; }
            .quote-icon { width: 55px !important; height: 55px !important; top: -27.5px !important; }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
