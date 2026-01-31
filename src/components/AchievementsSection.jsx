import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Medal, Star, Crown, Target, ExternalLink } from 'lucide-react';

const AchievementsSection = ({ achievements = [], onOpenDetail }) => {
  return (
    <section id="achievements" style={{
      borderTop: '1px solid var(--border-color)',
      padding: '40px 10% 120px',
      background: 'linear-gradient(180deg, var(--bg-color) 0%, rgba(255,107,0,0.02) 100%)',
      position: 'relative'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, var(--accent-primary) 2px, transparent 2px)',
        backgroundSize: '80px 80px',
        animation: 'float 20s ease-in-out infinite'
      }} />

      <div className="section-header-premium" style={{ marginBottom: '80px' }}>

        <h2 className="section-title-premium">
          <span className="section-title-accent">ACHIEVEMENTS</span>
          <span className="section-title-stroke">& AWARDS</span>
        </h2>
      </div>

      {/* Achievements Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        {achievements.map((achievement, idx) => (
          <AchievementCard
            key={achievement.id || idx}
            achievement={achievement}
            index={idx}
            onClick={() => onOpenDetail && onOpenDetail(achievement)}
          />
        ))}
      </div>

      {achievements.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '100px 20px',
          color: 'var(--text-secondary)',
          position: 'relative',
          zIndex: 1
        }}>
          <Trophy size={60} style={{ opacity: 0.2, marginBottom: '20px' }} />
          <p style={{ fontSize: '1.2rem', fontFamily: "'Inter', sans-serif, sans-serif" }}>
            No achievements added yet.
          </p>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 1024px) {
          #achievements {
            padding: 100px 120px 100px 5% !important;
          }
        }

        @media (max-width: 768px) {
          #achievements {
            padding: 80px 5% !important;
          }
          #achievements > div:nth-child(3) {
            grid-template-columns: 1fr !important;
            gap: 25px !important;
          }
        }

        @media (max-width: 480px) {
          #achievements {
            padding: 60px 20px !important;
          }
        }
      `}</style>
    </section>
  );
};

const AchievementCard = ({ achievement, index, onClick }) => {
  const getIcon = () => {
    switch (achievement.type?.toLowerCase()) {
      case 'trophy': return Trophy;
      case 'medal': return Medal;
      case 'crown': return Crown;
      case 'target': return Target;
      case 'star': return Star;
      default: return Award;
    }
  };

  const Icon = getIcon();
  const color = achievement.color || 'var(--accent-primary)';

  const bgImage = achievement.imageUrl || achievement.image || `https://source.unsplash.com/random/400x300?${achievement.title.split(' ')[0]}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className="achievement-card-premium"
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        height: '420px',
        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`,
        background: '#000'
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.6,
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        filter: 'grayscale(100%) brightness(0.7)'
      }} className="card-bg-image" />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)',
        zIndex: 1
      }} />

      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${color}cc, transparent)`,
          zIndex: 2, mixBlendMode: 'overlay'
        }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 3
      }}>
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          right: '30px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={24} color="#fff" />
          </div>

          {achievement.date && (
            <div style={{
              padding: '8px 16px',
              borderRadius: '100px',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.75rem',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              {achievement.date}
            </div>
          )}
        </div>

        <div style={{ transform: 'translateY(20px)', transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '10px' }} className="card-content">
          {achievement.issuer && (
            <div style={{
              color: color || 'var(--accent-primary)',
              fontSize: '0.85rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontWeight: 800,
              marginBottom: '10px',
              fontFamily: "'Cinzel', serif",
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}>
              {achievement.issuer}
            </div>
          )}

          <h3 style={{
            color: '#fff',
            fontSize: '2.2rem',
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.1,
            marginBottom: '15px',
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {achievement.title}
          </h3>

          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1rem',
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif",
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '25px',
            fontWeight: 400
          }}>
            {achievement.description || achievement.desc}
          </p>

          <motion.div
            className="view-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--accent-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              padding: '14px 30px',
              border: '1px solid var(--accent-primary)',
              borderRadius: '50px',
              width: 'fit-content',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease',
              marginTop: '5px'
            }}>
            <span>View Certificate</span>
            <ExternalLink size={16} style={{ transition: 'transform 0.3s ease' }} className="btn-icon" />
          </motion.div>
        </div>
      </div>

      <style>{`
          .achievement-card-premium:hover .card-bg-image {
              transform: scale(1.1);
              filter: grayscale(0%) brightness(0.6);
          }
          .achievement-card-premium:hover .card-content {
              transform: translateY(0);
          }
          .achievement-card-premium:hover .view-btn {
              background: var(--accent-primary) !important;
              color: #fff !important;
              border-color: var(--accent-primary) !important;
              box-shadow: 0 0 20px var(--accent-primary)44;
          }
           .achievement-card-premium:hover .btn-icon {
              transform: translateX(3px) translateY(-3px);
          }
      `}</style>
    </motion.div>
  );
};

export default AchievementsSection;
