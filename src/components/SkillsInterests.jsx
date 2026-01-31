import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb, PenTool, Zap, RefreshCw, Heart, Layers, ArrowUpRight, Scale, Anchor, Target, Palette, Feather
} from 'lucide-react';

const philosophies = [
  {
    id: "ph1",
    title: "VISION",
    subtitle: "The North Star",
    icon: Lightbulb,
    color: "#facc15", // Yellow
    description: "Seeing beyond the immediate horizon. It's not just about what we build today, but how it shapes the future.",
    tags: ["Foresight", "Innovation", "Clarity"]
  },
  {
    id: "ph2",
    title: "CRAFT",
    subtitle: "The Foundation",
    icon: PenTool,
    color: "#a855f7", // Purple
    description: "Merging logic with aesthetics. Every line of code and every pixel is placed with intentionality and precision.",
    tags: ["Precision", "Artistry", "Quality"]
  },
  {
    id: "ph3",
    title: "VELOCITY",
    subtitle: "The Momentum",
    icon: Zap,
    color: "#ef4444", // Red
    description: "Speed matters, but direction matters more. moving fast without breaking things by building on solid architecture.",
    tags: ["Speed", "Efficiency", "Agility"]
  },
  {
    id: "ph4",
    title: "ADAPTABILITY",
    subtitle: "The Flow",
    icon: RefreshCw,
    color: "#3b82f6", // Blue
    description: "The only constant is change. Thriving in ambiguity and pivoting strategies as technology evolves.",
    tags: ["Flexibility", "Growth", "Evolution"]
  },
  {
    id: "ph5",
    title: "IMPACT",
    subtitle: "The Purpose",
    icon: Heart,
    color: "#ec4899", // Pink
    description: "Building for people, not just screens. Creating solutions that solve real problems and elevate the human experience.",
    tags: ["Empathy", "User-Centric", "Value"]
  },
  {
    id: "ph6",
    title: "STRUCTURE",
    subtitle: "The Framework",
    icon: Layers,
    color: "#10b981", // Emerald
    description: "Scalable systems are beautiful systems. Writing clean, maintainable code that stands the test of time.",
    tags: ["Scalability", "Order", "Logic"]
  }
];

const SkillsInterests = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="philosophy" style={{
      padding: '120px 5%',
      background: 'var(--bg-color)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)',
        zIndex: 0
      }} />

      <div className="section-header-premium" style={{ marginBottom: '100px', position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: '1000px', margin: '0 auto 80px' }}>

        {/* Decorative Watermark */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '15rem',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.02)',
          fontFamily: "'Playfair Display', serif", // More elegant font
          zIndex: -1,
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          06
        </div>

        {/* Left Decorative Group */}
        <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.4, paddingLeft: '40px' }} className="header-decor-left">
          <div style={{ width: '60px', height: '1px', background: 'var(--accent-primary)' }}></div>
          <Palette size={24} color="var(--accent-primary)" />
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', color: 'var(--accent-primary)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '2px' }}>ARTISTRY</div>
        </div>

        {/* Right Decorative Group */}
        <div style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.4, paddingRight: '40px' }} className="header-decor-right">
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.8rem', color: 'var(--accent-secondary)', writingMode: 'vertical-rl', letterSpacing: '2px' }}>DESIGN</div>
          <Feather size={24} color="var(--accent-secondary)" />
          <div style={{ width: '60px', height: '1px', background: 'var(--accent-secondary)' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'inline-block', padding: '8px 24px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '25px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(5px)' }}
        >
          <span style={{ fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }}></span>
            The Code
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-secondary)' }}></span>
          </span>
        </motion.div>

        <h2 className="section-title-premium" style={{ position: 'relative', display: 'inline-block' }}>
          <span className="section-title-accent">MY</span>
          <span className="section-title-stroke"> PHILOSOPHY</span>
          {/* Subtle glow behind title */}
          <div style={{ position: 'absolute', inset: '-20px', background: 'var(--accent-primary)', filter: 'blur(50px)', zIndex: -1, opacity: 0.15 }}></div>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {philosophies.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = hoveredIndex === idx;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'relative',
                background: 'var(--card-bg)',
                border: `1px solid ${isHovered ? item.color : 'var(--border-color)'}`,
                borderRadius: '24px',
                padding: '40px',
                height: '320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'default',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                boxShadow: isHovered ? `0 20px 40px -10px ${item.color}22` : 'none'
              }}
            >
              {/* Background Gradient Hover */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at top right, ${item.color}15 0%, transparent 60%)`,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.4s ease'
              }} />

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: isHovered ? item.color : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s ease',
                    color: isHovered ? '#000' : item.color
                  }}>
                    <Icon size={24} />
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.3)',
                    fontWeight: 700
                  }}>
                    0{idx + 1}
                  </div>
                </div>

                <h3 style={{
                  fontSize: '2rem',
                  fontFamily: "'Cinzel', serif",
                  color: 'var(--text-primary)',
                  marginBottom: '10px'
                }}>
                  {item.title}
                </h3>

                <div style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: item.color,
                  fontWeight: 700,
                  marginBottom: '20px',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  {item.subtitle}
                </div>
              </div>

              <div>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: '20px',
                  opacity: isHovered ? 1 : 0.7,
                  transition: 'opacity 0.3s ease'
                }}>
                  {item.description}
                </p>

                <div style={{ height: '1px', width: '100%', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.75rem',
                      color: isHovered ? '#fff' : 'rgba(255,255,255,0.4)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.05)',
                      transition: 'color 0.3s ease'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
            #philosophy {
                padding: 80px 5% !important;
            }
            .section-title-premium {
                font-size: 2rem !important;
            }
            .header-decor-left, .header-decor-right {
                display: none !important;
            }
        }
      `}</style>
    </section>
  );
};

export default SkillsInterests;
