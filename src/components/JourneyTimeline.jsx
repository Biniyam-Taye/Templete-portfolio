import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Award, Heart, Star, Zap, Compass, Map, Flag, RefreshCcw, ArrowRight } from 'lucide-react';

const JourneyTimeline = ({ milestones = [], onOpenDetail }) => {
  return (
    <section id="journey" style={{
      borderTop: '1px solid var(--border-color)',
      padding: '120px 10% 40px',
      background: 'var(--bg-color)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decoration */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, var(--accent-primary)08 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="section-header-premium" style={{ marginBottom: '100px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>

        {/* Left Decoration */}
        <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '20px', opacity: 0.3, alignItems: 'center' }} className="header-decoration-left">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <Compass size={40} color="var(--accent-primary)" />
          </motion.div>
          <div style={{ width: '1px', height: '100px', background: 'linear-gradient(to bottom, var(--accent-primary), transparent)' }}></div>
          <Map size={30} color="var(--text-secondary)" />
        </div>

        {/* Center Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', maxWidth: '800px' }}>

          {/* Top Decorative Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              color: 'var(--accent-primary)',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
          >
            <span style={{ width: '40px', height: '1px', background: 'var(--accent-primary)' }}></span>
            The Path So Far
            <span style={{ width: '40px', height: '1px', background: 'var(--accent-primary)' }}></span>
          </motion.div>

          <h2 className="section-title-premium" style={{ margin: 0 }}>
            <span className="section-title-accent" style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(3rem, 5vw, 5rem)' }}>LIFE</span>
            <span className="section-title-stroke" style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.2em', fontSize: 'clamp(3rem, 5vw, 5rem)' }}>JOURNEY</span>
          </h2>

          {/* Description / Quote */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              maxWidth: '600px',
              textAlign: 'center',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}
          >
            "Every milestone is a stepping stone to the next great adventure. A curated timeline of professional growth and personal evolution."
          </motion.p>

          {/* Mini Stats Row */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              display: 'flex',
              gap: '60px',
              marginTop: '20px',
              padding: '20px 40px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: "'Cinzel', serif", color: 'var(--text-primary)' }}>{milestones.length}+</div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)' }}>Milestones</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: "'Cinzel', serif", color: 'var(--text-primary)' }}>5+</div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)' }}>Years Exp.</div>
            </div>
          </motion.div>

        </div>

        {/* Right Decoration */}
        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '20px', opacity: 0.3, alignItems: 'center' }} className="header-decoration-right">
          <Flag size={30} color="var(--text-secondary)" />
          <div style={{ width: '1px', height: '100px', background: 'linear-gradient(to top, var(--accent-secondary), transparent)' }}></div>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
            <RefreshCcw size={40} color="var(--accent-secondary)" />
          </motion.div>
        </div>

        <style>{`
            @media (max-width: 1024px) {
                .header-decoration-left, .header-decoration-right {
                    display: none !important;
                }
            }
        `}</style>

      </div>

      {/* Timeline */}
      <div style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        zIndex: 1
      }}>
        {/* Center Line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'linear-gradient(to bottom, transparent, var(--border-color), var(--accent-primary), var(--border-color), transparent)',
          transform: 'translateX(-50%)',
          zIndex: 0,
          opacity: 0.5
        }} />

        {milestones.map((milestone, idx) => {
          const isLeft = idx % 2 === 0;
          const Icon = milestone.icon === 'award' ? Award
            : milestone.icon === 'heart' ? Heart
              : milestone.icon === 'star' ? Star
                : milestone.icon === 'zap' ? Zap
                  : Star;

          return (
            <motion.div
              key={milestone.id || idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              style={{
                position: 'relative',
                marginBottom: '120px',
                display: 'grid',
                gridTemplateColumns: '1fr 80px 1fr',
                gap: '0',
                alignItems: 'center'
              }}
            >
              {/* Left Content */}
              <div style={{
                gridColumn: isLeft ? '1' : '3',
                textAlign: isLeft ? 'right' : 'left',
                paddingRight: isLeft ? '50px' : '0',
                paddingLeft: isLeft ? '0' : '50px',
                order: isLeft ? 1 : 3
              }}>
                <MilestoneCard
                  milestone={milestone}
                  isLeft={isLeft}
                  onClick={() => onOpenDetail && onOpenDetail(milestone)}
                />
              </div>

              {/* Center Icon */}
              <div style={{
                gridColumn: '2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
                order: 2
              }}>
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--bg-color)',
                    border: `2px solid ${milestone.color || 'var(--accent-primary)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px ${milestone.color || 'var(--accent-primary)'}44`,
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => onOpenDetail && onOpenDetail(milestone)}
                >
                  <Icon size={20} color={milestone.color || 'var(--accent-primary)'} />
                </motion.div>
              </div>

              {/* Right Content (Visual Side) */}
              <div style={{
                gridColumn: isLeft ? '3' : '1',
                paddingLeft: isLeft ? '50px' : '0',
                paddingRight: isLeft ? '0' : '50px',
                order: isLeft ? 3 : 1,
                display: 'flex',
                justifyContent: isLeft ? 'flex-start' : 'flex-end'
              }}>
                <TimelineVisual milestone={milestone} isLeft={!isLeft} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {milestones.length === 0 && (
        <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-secondary)' }}>No milestones found.</div>
      )}

      {/* View Full Journey CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ marginTop: '0px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(217, 70, 239, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'transparent',
            border: '1px solid var(--accent-primary)',
            padding: '16px 40px',
            borderRadius: '100px',
            color: 'var(--text-primary)',
            fontFamily: "'Cinzel', serif",
            fontSize: '1rem',
            letterSpacing: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            position: 'relative',
            overflow: 'hidden',
            textTransform: 'uppercase'
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>View Full Journey</span>
          <ArrowRight size={20} color="var(--accent-primary)" style={{ position: 'relative', zIndex: 1 }} />

          {/* Hover Fill Effect */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'var(--accent-primary)',
              zIndex: 0,
              opacity: 0
            }}
            whileHover={{ opacity: 0.1 }}
          />
        </motion.button>
      </motion.div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          #journey > div > div {
            grid-template-columns: 60px 1fr !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 40px !important;
          }
          #journey .section-header-premium {
            margin-bottom: 60px !important;
          }
           /* Correcting visual side on mobile */
           #journey > div > div > div:nth-child(3) {
             order: 4 !important; /* Move visual to bottom */
             padding: 0 !important;
             margin-top: 20px;
           }
           #journey > div > div > div:first-child {
             padding: 0 !important;
             text-align: left !important;
             order: 2 !important;
           }
            #journey > div > div > div:nth-child(2) {
             order: 1 !important;
             align-self: flex-start;
           }
        }
      `}</style>
    </section>
  );
};

const TimelineVisual = ({ milestone, isLeft }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotate: isLeft ? -1 : 1 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100%',
        height: '240px',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-color)',
        opacity: 0.9
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--card-bg)', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Abstract pattern placeholder */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${milestone.color || 'var(--accent-primary)'}33 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          opacity: 0.5
        }}></div>

        <div style={{
          color: 'var(--text-stroke)', fontSize: '4rem', opacity: 0.2,
          fontFamily: "'Cinzel', serif", fontWeight: 700
        }}>
          {milestone.date ? milestone.date.split(' ')[0] : '2024'}
        </div>
      </div>

      {/* If real image exists, show it */}
      {(milestone.image || milestone.imageUrl) && (
        <img
          src={milestone.image || milestone.imageUrl}
          alt={milestone.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, var(--bg-color), transparent)`,
        zIndex: 3, opacity: 0.4
      }} />
    </motion.div>
  )
}

const MilestoneCard = ({ milestone, isLeft, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: `0 20px 40px -10px ${milestone.color || 'var(--accent-primary)'}22` }}
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: `1px solid rgba(255, 255, 255, 0.05)`,
        borderRadius: '16px',
        padding: '35px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Decorative accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
        background: milestone.color || 'var(--accent-primary)',
        opacity: 0.5
      }} />

      {/* Category Badge */}
      {milestone.category && (
        <div style={{
          display: 'inline-block',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontFamily: "'Cinzel', serif",
          color: milestone.color || 'var(--accent-secondary)',
          marginBottom: '20px',
          opacity: 0.9
        }}>
          {milestone.category}
        </div>
      )}

      {/* Title */}
      <h3 style={{
        fontSize: '2rem',
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontWeight: 400,
        color: 'var(--text-primary)',
        marginBottom: '15px',
        lineHeight: 1.1
      }}>
        {milestone.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
        marginBottom: '25px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {milestone.description || milestone.desc}
      </p>

      {/* Meta Info */}
      <div style={{
        display: 'flex',
        gap: '20px',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        fontFamily: "'JetBrains Mono', monospace",
        justifyContent: 'flex-start',
        opacity: 0.7
      }}>
        {milestone.date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} />
            <span>{milestone.date}</span>
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default JourneyTimeline;
