import React from 'react';
import { motion } from 'framer-motion';
import { Book, Calendar, ArrowRight, Sparkles, PenTool, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LifeOSSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'diary',
      title: 'Digital Journal',
      subtitle: 'REFLECTIVE THINKING',
      desc: 'A private space to capture your thoughts, reflections, and daily progress. Document your journey with elegance.',
      image: '/life-os/diary.png',
      path: '/diary',
      icon: Book,
      color: '#fbbf24'
    },
    {
      id: 'plan',
      title: 'Strategic Planner',
      subtitle: 'ORGANIZED EXECUTION',
      desc: 'Plan your routines, track your goals, and master your time. Experience a new level of personal organization.',
      image: '/life-os/planner.png',
      path: '/plan',
      icon: Calendar,
      color: '#d946ef'
    }
  ];

  return (
    <section id="life-os" style={{
      padding: '120px 10%',
      backgroundColor: 'var(--bg-color)',
      position: 'relative',
      overflow: 'hidden',
      borderTop: '1px solid var(--border-color)'
    }}>
      {/* Background Decorative Element */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.05) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <div className="section-header-premium" style={{ marginBottom: '80px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <div style={{ width: '40px', height: '1.5px', background: 'var(--accent-primary)' }}></div>
          <span style={{ color: 'var(--accent-primary)', letterSpacing: '4px', fontSize: '0.75rem', fontWeight: 900 }}>PERSONAL PRODUCTIVITY</span>
        </div>
        <h2 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          fontFamily: "'Abril Fatface', serif", 
          color: 'var(--text-primary)',
          margin: 0,
          textTransform: 'uppercase'
        }}>
          LIFE <span style={{ color: 'gray', WebkitTextStroke: '1px var(--border-color)', WebkitTextFillColor: 'transparent' }}>OS</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginTop: '20px', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Sophisticated tools integrated into my daily workflow to ensure constant growth and impeccable organization.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        {features.map((feature, idx) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
            whileHover={{ y: -10 }}
            onClick={() => navigate(feature.path)}
            style={{
              cursor: 'pointer',
              position: 'relative',
              borderRadius: '32px',
              overflow: 'hidden',
              minHeight: '600px',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = feature.color;
              e.currentTarget.style.boxShadow = `0 20px 40px ${feature.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Feature Image */}
            <div style={{ width: '100%', height: '320px', overflow: 'hidden', position: 'relative' }}>
              <motion.img 
                src={feature.image} 
                alt={feature.title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to bottom, transparent, var(--card-bg))' 
              }} />
            </div>

            {/* Feature Content */}
            <div style={{ padding: '30px 40px 40px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <feature.icon size={20} color={feature.color} />
                  <span style={{ color: feature.color, letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 700 }}>{feature.subtitle}</span>
                </div>
                <h3 style={{ fontSize: '2rem', margin: '0 0 15px 0', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontSize: '1.05rem' }}>
                  {feature.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', letterSpacing: '1px' }}>LAUNCH APPLICATION</span>
                <ArrowRight size={18} color="var(--accent-primary)" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #life-os {
            padding: 80px 20px !important;
          }
          div[style*="gridTemplateColumns"] {
            gridTemplateColumns: 1fr !important;
          }
          div[style*="height: 550px"] {
            height: auto !important;
            min-height: 500px;
          }
          h3 {
             font-size: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default LifeOSSection;
