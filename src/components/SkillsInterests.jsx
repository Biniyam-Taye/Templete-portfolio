import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Heart, DollarSign, Activity, Zap, Users, Shield, Anchor, Target, Scale, Flame, ArrowRight, X
} from 'lucide-react';

// Reusing iconMap for fallback, but main logic will use direct mapping for the 6 principles
const iconMap = {
  mentality: Brain,
  physicality: Activity,
  health: Activity,
  financial: DollarSign,
  wealth: DollarSign,
  spirituality: Anchor,
  spiritual: Anchor,
  intellect: Zap,
  growth: Zap,
  relationships: Users,
  social: Users
};

// The 6 Core Principles Data
const corePrinciples = [
  {
    id: "p1",
    title: "MENTALITY",
    subtitle: "The Fortress",
    icon: "mentality",
    color: "#a855f7", // Purple
    description: "An unbreakable mind is the foundation of all success. Cultivating resilience, focus, and an unwavering belief in one's vision, regardless of external circumstances.",
    tags: ["Resilience", "Discipline", "Focus"]
  },
  {
    id: "p2",
    title: "PHYSICALITY",
    subtitle: "The Vessel",
    icon: "health",
    color: "#ef4444", // Red
    description: "The body is the vehicle through which we experience life. Prioritizing strength, vitality, and longevity to ensuring peak performance in all other arenas.",
    tags: ["Strength", "Energy", "Longevity"]
  },
  {
    id: "p3",
    title: "FINANCIAL",
    subtitle: "The Engine",
    icon: "financial",
    color: "#22c55e", // Green
    description: "Building sustainable wealth not just for luxury, but for freedom. Mastering resources to create impact, security, and opportunities for others.",
    tags: ["Freedom", "Investment", "Security"]
  },
  {
    id: "p4",
    title: "SPIRITUALITY",
    subtitle: "The Anchor",
    icon: "spiritual",
    color: "#3b82f6", // Blue
    description: "Connecting to a purpose greater than oneself. Finding grounding through gratitude, mindfulness, and an alignment with core values.",
    tags: ["Purpose", "Peace", "Gratitude"]
  },
  {
    id: "p5",
    title: "INTELLECT",
    subtitle: "The Blade",
    icon: "intellect",
    color: "#eab308", // Yellow
    description: "Sharpening the mind through constant learning and curiosity. Adapting to new information and seeking truth in a complex world.",
    tags: ["Learning", "Curiosity", "Wisdom"]
  },
  {
    id: "p6",
    title: "RELATIONSHIPS",
    subtitle: "The Network",
    icon: "relationships",
    color: "#ec4899", // Pink
    description: "Success is meaningless in isolation. Building deep, authentic connections and leading with empathy to uplift the collective.",
    tags: ["Leadership", "Empathy", "Community"]
  }
];

const SkillsInterests = () => {
  const [selectedPrinciple, setSelectedPrinciple] = useState(null);

  const getIcon = (iconName) => {
    const Icon = iconMap[iconName] || Zap;
    return Icon;
  };

  return (
    <>
      <section id="principles" style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-color)', // Dark theme background from global CSS
        padding: '120px 10%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="section-header-premium" style={{ marginBottom: '80px', position: 'relative', zIndex: 1 }}>
          <h2 className="section-title-premium">
            <span className="section-title-accent">MY CORE</span>
            <span className="section-title-stroke"> PRINCIPLES</span>
          </h2>
          <p style={{
            maxWidth: '700px',
            margin: '20px auto 0',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif"
          }}>
            The six pillars that define my approach to life, work, and growth. A holistic framework for sustainable success.
          </p>
        </div>

        {/* Monolith Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          position: 'relative',
          zIndex: 1
        }}>
          {corePrinciples.map((principle, idx) => {
            const Icon = getIcon(principle.icon);

            return (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, boxShadow: `0 20px 40px -10px ${principle.color}30` }}
                onClick={() => setSelectedPrinciple(principle)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '40px 30px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: '400px', // Tall vertical cards
                  justifyContent: 'center'
                }}
              >
                {/* Glowing Border Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '24px',
                  padding: '1px',
                  background: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, ${principle.color} 100%)`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none',
                  opacity: 0.5
                }} />

                {/* Animated Background Blob */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.5
                  }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: principle.color,
                    filter: 'blur(60px)',
                    zIndex: 0
                  }} />

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                  {/* Icon */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `rgba(0,0,0,0.3)`,
                    border: `1px solid ${principle.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 30px',
                    boxShadow: `0 0 20px ${principle.color}20`
                  }}>
                    <Icon size={36} color={principle.color} strokeWidth={1.5} />
                  </div>

                  {/* Subtitle */}
                  <div style={{
                    fontSize: '0.8rem',
                    color: principle.color,
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '10px',
                    fontWeight: 600
                  }}>
                    {principle.subtitle}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '2rem',
                    fontFamily: "'Abril Fatface', serif",
                    color: 'white',
                    marginBottom: '20px',
                    letterSpacing: '1px',
                    lineHeight: 1
                  }}>
                    {principle.title}
                  </h3>

                  {/* Description (Truncated) */}
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.6,
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: '30px',
                    maxHeight: '80px',
                    overflow: 'hidden'
                  }}>
                    {principle.description}
                  </p>

                  {/* Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      padding: '10px 20px',
                      borderRadius: '100px',
                      background: `linear-gradient(90deg, ${principle.color}20, ${principle.color}40)`,
                      border: `1px solid ${principle.color}40`,
                      cursor: 'pointer'
                    }}
                  >
                    EXPLORE <ArrowRight size={16} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPrinciple && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPrinciple(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 2000,
                cursor: 'pointer'
              }}
            />

            <div style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2001,
              pointerEvents: 'none',
              padding: '20px'
            }}>
              <motion.div
                layoutId={`principle-card-${selectedPrinciple.id}`}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                style={{
                  width: 'min(600px, 95vw)',
                  background: '#111',
                  border: `1px solid ${selectedPrinciple.color}`,
                  borderRadius: '30px',
                  padding: '50px',
                  boxShadow: `0 0 100px ${selectedPrinciple.color}20`,
                  position: 'relative',
                  pointerEvents: 'auto',
                  overflow: 'hidden'
                }}
              >
                {/* Background Glow inside Modal */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(circle, ${selectedPrinciple.color}10 0%, transparent 60%)`,
                  pointerEvents: 'none',
                  zIndex: 0
                }} />

                <button
                  onClick={() => setSelectedPrinciple(null)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  <X size={24} />
                </button>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <div style={{ marginBottom: '20px', color: selectedPrinciple.color }}>
                    {React.createElement(getIcon(selectedPrinciple.icon), { size: 64 })}
                  </div>

                  <h2 style={{
                    fontFamily: "'Abril Fatface', serif",
                    fontSize: '3rem',
                    color: 'white',
                    marginBottom: '10px'
                  }}>
                    {selectedPrinciple.title}
                  </h2>

                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    color: selectedPrinciple.color,
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    marginBottom: '30px',
                    fontWeight: 700
                  }}>
                    {selectedPrinciple.subtitle}
                  </div>

                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.7,
                    marginBottom: '40px'
                  }}>
                    {selectedPrinciple.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    {selectedPrinciple.tags.map((tag, i) => (
                      <span key={i} style={{
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: `1px solid ${selectedPrinciple.color}40`,
                        color: selectedPrinciple.color,
                        fontSize: '0.8rem',
                        fontFamily: "'Inter', sans-serif"
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SkillsInterests;
