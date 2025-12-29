import React, { useEffect, useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useCollection } from '../hooks/useCollection';
import { MessageSquare, X, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced Chatbase AI Assistant with Dynamic Firebase Data
 * 
 * This component combines:
 * - Chatbase for reliable chat UI (no quota issues)
 * - Firebase for real-time project data
 * - Dynamic context injection so AI always knows latest projects
 * 
 * Update: Implements CUSTOM UI LAUNCHER to fix open/close toggle issues.
 */

const ChatbaseAssistant = () => {
  const { projects, loading: pLoading } = useProjects();
  const { data: skills, loading: sLoading } = useCollection('skills');
  const { data: experience, loading: eLoading } = useCollection('experience');
  const [chatbaseReady, setChatbaseReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Chatbase configuration - Hide default launcher to use our custom one
    window.embeddedChatbotConfig = {
      chatbotId: "iewClPvy5zF7KuKHOcrUR",
      domain: "www.chatbase.co"
    };

    // Load Chatbase embed script
    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute('chatbotId', 'iewClPvy5zF7KuKHOcrUR');
    script.defer = true;
    
    script.onload = () => {
      setChatbaseReady(true);
    };
    
    document.body.appendChild(script);

    // Watch for Chatbase's "black background" bug and KILL IT
    const observer = new MutationObserver(() => {
      const html = document.documentElement;
      if (html.classList.contains('__cb_widget_active')) {
        // Force width and visibility back
        html.style.setProperty('width', '100vw', 'important');
        html.style.setProperty('height', '100%', 'important');
        html.style.setProperty('position', 'relative', 'important');
        html.style.setProperty('overflow', 'auto', 'important');
        
        const body = document.body;
        body.style.setProperty('width', '100vw', 'important');
        body.style.setProperty('height', '100%', 'important');
        body.style.setProperty('position', 'relative', 'important');
        body.style.setProperty('display', 'block', 'important');
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Cleanup function
    return () => {
      observer.disconnect();
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Inject dynamic project data into Chatbase when ready
  useEffect(() => {
    const loading = pLoading || sLoading || eLoading;

    if (chatbaseReady && !loading) {
      // 1. Build project context
      const projectContext = projects.map((p, idx) => 
        `- ${p.title}: ${p.desc} (Tech: ${Array.isArray(p.tech) ? p.tech.join(', ') : p.tech})`
      ).join('\n');

      // 2. Build Skills context
      const skillsContext = skills.map(s => 
        `- ${s.name}: ${s.level}% proficient (${s.category})`
      ).join('\n');

      // 3. Build Experience context
      const expContext = experience.map(e => 
        `- ${e.title} at ${e.company} (${e.period}): ${e.desc}`
      ).join('\n');

      // 4. Build Identity Summary (From Landing Page)
      const identitySummary = `
Mente is a Full-Stack Developer & AI Engineer.
Specialization: Building performant web ecosystems that merge cutting-edge AI logic with premium, minimal design aesthetics.
Tagline: "Engineering Beautiful Intelligence"
Email: hello@mente.co
Availability: Available for freelance projects and team collaborations.
Status: Current Portfolio Status is LIVE with dynamic data.
      `;

      // Inject EVERYTHING into Chatbase
      if (window.chatbase) {
        window.chatbase('setCustomData', {
          identitySummary: identitySummary,
          fullEcosystem: `
PROJECTS ARCHIVE:
${projectContext}

TECHNICAL SKILLS:
${skillsContext}

PROFESSIONAL EXPERIENCE:
${expContext}
          `,
          projectCount: projects.length,
          lastUpdated: new Date().toLocaleTimeString()
        });

        // Set dynamic welcome
        window.chatbase('setInitialMessages', [
          {
            role: 'assistant',
            content: `Hi! I'm Mente's AI. I currently track ${projects.length} projects and ${skills.length} core technical skills. How can I assist you today?`
          }
        ]);
      }
    }
  }, [chatbaseReady, pLoading, sLoading, eLoading, projects, skills, experience]);

  const toggleChat = () => {
    if (window.chatbase) {
      if (isOpen) {
        window.chatbase('close'); // Explicit close
      } else {
        window.chatbase('open'); // Explicit open
      }
      setIsOpen(!isOpen);
    }
  };

  if (!chatbaseReady) return null;

  return (
    <>
      <style>{`
        /* Hide default Chatbase bubble to prevent duplicates/issues */
        #chatbase-bubble-button { display: none !important; }
        iframe#chatbase-bubble-window { bottom: 100px !important; right: 30px !important; }
      `}</style>
      
      <AnimatePresence>
        {!isOpen && chatbaseReady && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            style={{
              position: 'fixed',
              bottom: window.innerWidth < 768 ? '122px' : '42px',
              right: window.innerWidth < 768 ? '20px' : '105px',
              background: 'white',
              color: 'black',
              padding: '8px 16px',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 700,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              zIndex: 99998,
              pointerEvents: 'none'
            }}
          >
            {window.innerWidth < 768 ? 'AI' : 'Ask AI Assistant'}
            <div style={{
              position: 'absolute',
              right: window.innerWidth < 768 ? '50%' : '-6px',
              bottom: window.innerWidth < 768 ? '-6px' : 'auto',
              top: window.innerWidth < 768 ? 'auto' : '50%',
              transform: window.innerWidth < 768 ? 'translateX(50%) rotate(45deg)' : 'translateY(-50%) rotate(45deg)',
              width: '12px',
              height: '12px',
              background: 'white',
              zIndex: -1
            }} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="chat-toggle-btn"
        onClick={toggleChat}
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: window.innerWidth < 768 ? '110px' : '30px',
          right: window.innerWidth < 768 ? '20px' : '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          border: 'none',
          boxShadow: '0 10px 30px rgba(255, 107, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          zIndex: 99999
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div 
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
            >
              <MessageSquare size={28} fill="white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default ChatbaseAssistant;
