import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Layout,
  Star,
  Plane,
  Trophy,
  Map,
  Book,
  Mail,
  Sun,
  Moon
} from 'lucide-react';
import { useCollection } from '../hooks/useCollection';

const navItems = [
  { id: 'hero', label: 'Home', icon: <Home size={22} />, href: '#' },
  { id: 'about', label: 'About', icon: <User size={22} />, href: '#about' },
  { id: 'portfolio', label: 'Portfolio', icon: <Layout size={22} />, href: '#portfolio' },
  { id: 'skills', label: 'Expertise', icon: <Star size={22} />, href: '#skills' },
  { id: 'journey', label: 'Journey', icon: <Plane size={22} />, href: '#journey' },
  { id: 'achievements', label: 'Achievements', icon: <Trophy size={22} />, href: '#achievements' },
  { id: 'plan', label: 'Plan', icon: <Map size={22} />, href: '#plan' },
  { id: 'diary', label: 'Diary', icon: <Book size={22} />, href: '/diary' },
  { id: 'contact', label: 'Contact', icon: <Mail size={22} />, href: '#contact' },
];

const SidebarNav = () => {
  const { data: homeData, loading } = useCollection('home');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  // High-performance abstract placeholder
  const DEFAULT_PLACEHOLDER = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000";

  const sidebarImage = "/logo.svg";

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.body.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          position: 'fixed',
          right: '24px',
          top: '15px',
          width: '80px',
          height: 'auto',
          maxHeight: '96vh',
          background: 'var(--sidebar-bg)',
          backdropFilter: 'blur(25px)',
          borderRadius: '40px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '15px 0',
          zIndex: 1000,
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          gap: '8px'
        }}
      >
        {/* Profile Picture Logo */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '10px',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          <span style={{
            fontFamily: "'Abril Fatface', serif",
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-1px'
          }}>
            SJ
          </span>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          {navItems.map((item) => (
            <div
              key={item.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.a
                href={item.href}
                whileHover={{ scale: 1.15, background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: hoveredItem === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
              >
                {item.icon}
              </motion.a>

              {/* Hover Tooltip Label - FIXED: Appears on LEFT */}
              <AnimatePresence>
                {hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '100%', /* Push to the left of the button */
                      left: 'auto',
                      transform: 'translateY(-50%)',
                      background: 'var(--text-primary)',
                      color: 'var(--bg-color)',
                      padding: '8px 20px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      zIndex: 1001,
                      marginRight: '15px' /* Gap between tooltip and button */
                    }}
                  >
                    {item.label}
                    <div style={{
                      position: 'absolute',
                      right: '-4px', /* Arrow points to the button on the right */
                      left: 'auto',
                      top: '50%',
                      transform: 'translateY(-50%) rotate(45deg)',
                      width: '10px',
                      height: '10px',
                      background: 'var(--text-primary)',
                      zIndex: -1
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Theme Toggle & Settings at Bottom */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '15px' }}>
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, background: 'rgba(255,b,0,0.1)' }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              border: 'none',
              background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {/* Settings button removed */}
        </div>
      </motion.div>

      <style>{`
      /* Mobile Responsive Styles for Sidebar */
      @media (max-width: 768px) {
        /* Move sidebar to bottom on mobile with better visibility */
        div[style*="position: fixed"][style*="left: 24px"] {
          left: 0 !important;
          right: 0 !important;
          top: auto !important;
          bottom: 0 !important;
          width: 100vw !important;
          max-width: 100vw !important;
          height: 70px !important;
          max-height: 70px !important;
          border-radius: 0 !important;
          flex-direction: row !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 8px 12px !important;
          gap: 8px !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          background: var(--sidebar-bg) !important;
          backdrop-filter: blur(30px) !important;
          border-top: 1.5px solid var(--border-color) !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: none !important;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.3) !important;
        }
        
        /* Hide logo/avatar on mobile */
        div[style*="position: fixed"] > div:first-child {
          display: none !important;
        }
        
        /* Nav items container - horizontal layout */
        div[style*="display: flex"][style*="flex-direction: column"][style*="gap: 4px"] {
          flex-direction: row !important;
          width: auto !important;
          gap: 6px !important;
          flex: 1 !important;
          justify-content: center !important;
          align-items: center !important;
          overflow-x: auto !important;
          padding: 0 !important;
        }
        
        /* Nav buttons */
        a[style*="width: 48px"][style*="height: 48px"] {
          width: 42px !important;
          height: 42px !important;
          min-width: 42px !important;
          flex-shrink: 0 !important;
          border-radius: 12px !important;
        }
        
        /* Bottom controls container - position at bottom right */
        div[style*="margin-top: auto"] {
          position: absolute !important;
          bottom: 8px !important;
          right: 8px !important;
          margin: 0 !important;
          flex-direction: column !important;
          gap: 6px !important;
          padding: 0 !important;
          border: none !important;
        }
        
        /* Theme toggle and settings buttons */
        button[style*="width: 48px"][style*="height: 48px"] {
          width: 42px !important;
          height: 42px !important;
          min-width: 42px !important;
          flex-shrink: 0 !important;
          border-radius: 12px !important;
        }
        
        /* Icons size */
        svg {
          width: 19px !important;
          height: 19px !important;
        }
        
        /* Hide tooltips on mobile */
        div[style*="position: absolute"][style*="whiteSpace: nowrap"] {
          display: none !important;
        }

        /* Prevent scrollbar from showing */
        div[style*="display: flex"][style*="flex-direction: column"][style*="gap: 4px"]::-webkit-scrollbar {
          display: none;
        }
      }
      
      @media (max-width: 480px) {
        /* More compact on very small screens */
        div[style*="position: fixed"][style*="left: 24px"] {
          height: 65px !important;
          max-height: 65px !important;
          padding: 6px 8px !important;
        }
        
        div[style*="display: flex"][style*="flex-direction: column"][style*="gap: 4px"] {
          gap: 4px !important;
        }
        
        a[style*="width: 48px"],
        button[style*="width: 48px"] {
          width: 38px !important;
          height: 38px !important;
          min-width: 38px !important;
          border-radius: 10px !important;
        }
        
        svg {
          width: 17px !important;
          height: 17px !important;
        }

        div[style*="margin-top: auto"] {
          bottom: 6px !important;
          right: 6px !important;
          gap: 4px !important;
        }
      }
    `}</style>
    </>
  );
};

export default SidebarNav;
