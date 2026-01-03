import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';


const FloatingDownloadButton = () => {
  const handleClick = () => {
    const link = document.createElement('a');
    link.href = '/cv/Mentesnot_Debele_Resume.pdf';
    link.download = 'Mentesnot_Debele_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
      style={{
        position: 'fixed',
        bottom: window.innerWidth < 768 ? '215px' : '135px', // Moved higher to avoid chatbox overlap
        right: window.innerWidth < 768 ? '22px' : '32px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {/* Label Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          color: 'var(--accent-primary)',
          padding: '4px 12px',
          borderRadius: '8px',
          fontSize: '0.65rem',
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 800,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          border: '1px solid var(--accent-primary)',
          whiteSpace: 'nowrap',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          pointerEvents: 'none'
        }}
      >
        {'DOWNLOAD CV'}
      </motion.div>

      {/* Floating Button */}
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1, backgroundColor: 'white', color: 'black' }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(255, 107, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Download size={24} />
        </div>
        
        {/* Glow Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'white',
            borderRadius: '50%',
            zIndex: 1
          }}
        />
      </motion.button>
    </motion.div>
  );
};

export default FloatingDownloadButton;
