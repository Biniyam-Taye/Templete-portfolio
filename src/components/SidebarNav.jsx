import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, User, Layout, Star, Plane, Trophy, Map, Book, Mail, Sun, Moon,
  Menu, X, PenTool
} from 'lucide-react';
import { useCollection } from '../hooks/useCollection';

const navItems = [
  { id: 'hero', label: 'Home', icon: <Home size={22} />, href: '/' },
  { id: 'about', label: 'About', icon: <User size={22} />, href: '#about' },
  { id: 'portfolio', label: 'Portfolio', icon: <Layout size={22} />, href: '#portfolio' },
  { id: 'skills', label: 'Expertise', icon: <Star size={22} />, href: '#skills' },
  { id: 'journey', label: 'Journey', icon: <Plane size={22} />, href: '#journey' },
  { id: 'achievements', label: 'Achievements', icon: <Trophy size={22} />, href: '#achievements' },
  { id: 'life-os', label: 'Life OS', icon: <PenTool size={22} />, href: '#life-os' },
  { id: 'plan', label: 'Plan', icon: <Layout size={22} />, href: '/plan' },
  { id: 'diary', label: 'Diary', icon: <Book size={22} />, href: '/diary' },
  { id: 'contact', label: 'Contact', icon: <Mail size={22} />, href: '#contact' },
];

const SidebarNav = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <motion.div
        className="desktop-sidebar"
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
        {/* Profile Logo */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          style={{
            width: '64px', height: '64px', borderRadius: '16px',
            marginBottom: '10px', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          <img 
            src="/favicon.png" 
            alt="Dominique" 
            style={{ 
              width: '80%', 
              height: '80%', 
              objectFit: 'contain',
              borderRadius: '8px' 
            }} 
          />
        </motion.div>

        {navItems.map((item) => (
          <div key={item.id} style={{ position: 'relative' }} onMouseEnter={() => setHoveredItem(item.id)} onMouseLeave={() => setHoveredItem(null)}>
            <motion.a
              href={item.href}
              whileHover={{ scale: 1.15, background: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '48px', height: '48px', borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: hoveredItem === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease', textDecoration: 'none'
              }}
            >
              {item.icon}
            </motion.a>
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  style={{
                    position: 'absolute', top: '50%', right: '100%', transform: 'translateY(-50%)',
                    background: 'var(--text-primary)', color: 'var(--bg-color)', padding: '8px 20px',
                    borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap',
                    pointerEvents: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1001, marginRight: '15px'
                  }}
                >
                  {item.label}
                  <div style={{ position: 'absolute', right: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', width: '10px', height: '10px', background: 'var(--text-primary)', zIndex: -1 }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <div style={{ marginTop: 'auto', paddingBottom: '15px' }}>
          <motion.button onClick={toggleTheme} whileHover={{ scale: 1.1 }} style={{ width: '48px', height: '48px', borderRadius: '16px', border: 'none', background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', cursor: 'pointer' }}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Toggle Button */}
      <motion.button
        className="mobile-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 2000,
          background: 'var(--sidebar-bg)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-color)', borderRadius: '12px',
          width: '44px', height: '44px', display: 'none', // Hidden on desktop
          alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '80px', right: '20px', width: '250px',
              background: 'var(--sidebar-bg)', backdropFilter: 'blur(25px)',
              borderRadius: '24px', border: '1px solid var(--border-color)',
              padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px',
              zIndex: 1999, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '15px',
                  padding: '12px', borderRadius: '12px',
                  color: 'var(--text-primary)', textDecoration: 'none',
                  background: 'rgba(255,255,255,0.05)', transition: 'background 0.2s'
                }}
              >
                {item.icon}
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{item.label}</span>
              </a>
            ))}
            <div style={{ height: '1px', background: 'var(--border-color)', margin: '10px 0' }} />
            <button
              onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '15px',
                padding: '12px', borderRadius: '12px', border: 'none',
                background: 'transparent', color: 'var(--text-primary)',
                cursor: 'pointer', fontSize: '15px', fontWeight: 500
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default SidebarNav;
