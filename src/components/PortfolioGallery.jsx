import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Eye, ArrowRight, Sparkles, Code, Palette, Zap, Layout, PenTool, Image, Smartphone, Globe, Cpu, Music, Camera, Layers, Hash, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioGallery = ({ items = [], onItemClick }) => {
  const categories = ['All', ...new Set(items.map(item => item.category).filter(Boolean))];
  const [activeCategory, setActiveCategory] = React.useState('All');
  const navigate = useNavigate();

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="constellation-wrapper" style={{
      borderTop: '1px solid var(--border-color)',
      padding: '120px 10%',
      position: 'relative'
    }}>
      {/* Decorative Background Icons */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.04,
        pointerEvents: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '60px',
        justifyContent: 'center',
        alignContent: 'flex-start',
        padding: '20px',
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
      }}>
        {Array.from({ length: 120 }).map((_, i) => {
          const Icon = [Code, Palette, Zap, Layout, PenTool, Image, Smartphone, Globe, Cpu, Music, Camera, Layers, Hash, Command][i % 14];
          return (
            <Icon
              key={i}
              size={24}
              style={{
                transform: `rotate(${i * 45}deg)`,
                opacity: Math.random() * 0.5 + 0.5
              }}
            />
          );
        })}
      </div>

      <div className="section-header-premium">
        <h2 className="section-title-premium" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="section-title-accent">VISUAL</span>
          <span style={{ color: 'gray' }}>STORIES</span>
        </h2>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="filter-container" style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center', // Center the buttons
          marginBottom: '40px',
          flexWrap: 'wrap', // Wrap them nicely
          padding: '0 5%',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                if (category === 'My Art Collection') {
                  navigate('/art-gallery');
                } else if (category === 'My Designs') {
                  navigate('/design-gallery');
                } else if (category === 'My Memories') {
                  navigate('/memories-gallery');
                } else {
                  setActiveCategory(category);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 20px', // Slightly smaller padding
                background: activeCategory === category
                  ? 'var(--accent-primary)'
                  : 'rgba(255,255,255,0.05)',
                color: activeCategory === category
                  ? 'black'
                  : 'var(--text-primary)',
                border: `1px solid ${activeCategory === category ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                borderRadius: '100px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem', // Slightly smaller font
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div
        className="grid-premium"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {filteredItems.map((item, idx) => (
          <PortfolioCard
            key={item.id || idx}
            item={item}
            index={idx}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '100px 20px',
          color: 'var(--text-secondary)',
          position: 'relative',
          zIndex: 1
        }}>
          <p style={{ fontSize: '1.2rem', fontFamily: "'Inter', sans-serif" }}>
            No items in this category yet.
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          #portfolio {
            display: none !important;
          }
          .grid-premium {
            grid-template-columns: repeat(2, 1fr) !important; /* 2 Columns */
            gap: 10px !important;
          }
          /* Ensure title is centered on mobile */
          .section-title-premium {
             font-size: 2.2rem !important; 
             display: flex !important;
             flex-direction: column !important;
             align-items: center !important;
             text-align: center !important;
             width: 100% !important;
             margin-bottom: 20px !important;
          }
          /* Adjust filter container for mobile - HIDDEN as requested */
          .filter-container {
             display: none !important;
          }
        }

        @media (max-width: 480px) {
          #portfolio {
            padding: 20px 10px !important;
          }
        }
        
        .portfolio-card-container {
             height: 500px;
        }
        .portfolio-card-title {
             fontSize: 2rem;
        }

        @media (max-width: 768px) {
             .portfolio-card-container {
                  height: 250px !important; /* Adjusted slightly */
             }
             .portfolio-card-title {
                  font-size: 1.2rem !important; /* Smaller font for mobile grid */
             }
             /* Adjust padding inside card for mobile */
             div[style*="padding: 30px"] {
                padding: 15px !important;
             }
             /* Hide description on very small screens if needed, or truncate */
             p {
                font-size: 0.8rem !important;
                line-height: 1.4 !important;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
             }
             /* Smaller button */
             button {
                padding: 8px 16px !important;
                font-size: 0.8rem !important;
             }
        }
      `}</style>
    </section>
  );
};

const PortfolioCard = ({ item, index, onClick }) => {
  return (
    <motion.div
      layoutId={`portfolio-card-${item.id || index}`}
      initial="visible" // Force visible state to prevent invisibility issues
      whileHover="hover"
      viewport={{ once: true }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hover: {
          y: -5, // Reduced movement
          borderColor: 'var(--accent-primary)',
          boxShadow: '0 10px 30px rgba(217, 70, 239, 0.15)'
        }
      }}
      onClick={onClick}
      className="ad-card portfolio-card-container"
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        isolation: 'isolate',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* Dynamic Background Image */}
      <motion.div
        className="ad-bg-image-wrapper"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}
        variants={{
          hover: { scale: 1.05 }
        }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      >
        <img
          src={item.imageUrl || item.image}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.85) contrast(1.1)'
          }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.1) 100%)'
        }} />
      </motion.div>

      {/* "Sponsored" / Category Tag */}
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '25px',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: '100px',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        <Sparkles size={14} color="var(--accent-primary)" fill="var(--accent-primary)" />
        <span style={{
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          {item.category || 'FEATURED'}
        </span>
      </div>

      {/* Content Overlay */}
      <motion.div
        variants={{
          initial: { gap: '5px' },
          visible: { gap: '5px' },
          hover: { gap: '15px' }
        }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '30px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <motion.h3
          className="portfolio-card-title"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.2,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            // fontSize handled by class
          }}
        >
          {item.title}
        </motion.h3>

        <motion.div
          variants={{
            initial: { height: 0, opacity: 0 },
            visible: { height: 0, opacity: 0 },
            hover: { height: 'auto', opacity: 1 }
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
        >
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif",
            marginBottom: '10px'
          }}>
            {item.description || item.desc}
          </p>
        </motion.div>

        {/* PROMINENT CTA BUTTON */}
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px'
          }}
        >
          <motion.button
            variants={{
              hover: {
                scale: 1.05,
                backgroundColor: 'var(--accent-primary)',
                color: 'black',
                border: '1px solid var(--accent-primary)'
              }
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'white',
              color: 'black',
              border: 'none',
              padding: '16px 28px',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(0,0,0,0.4)',
              transition: 'all 0.2s ease',
              flex: 1,
              maxWidth: '200px'
            }}
          >
            VIEW PROJECT
            <ArrowRight size={18} />
          </motion.button>

          {/* Subtle indicator if needed */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Eye size={18} color="rgba(255,255,255,0.7)" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PortfolioGallery;
