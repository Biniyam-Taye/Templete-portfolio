import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const StrategicThinking = () => {
    const strategies = [
        { title: "Q3 Career Goals", impact: "High", effort: "Medium", desc: "Focus on networking and certification." },
        { title: "Side Project Pivot", impact: "Medium", effort: "High", desc: "Refactoring the backend for scalability." },
        { title: "Financial Freedom Plan", impact: "High", effort: "High", desc: "Investment diversification strategy." },
        { title: "Minimalist Lifestyle", impact: "Low", effort: "Medium", desc: "Decluttering digital and physical space." },
    ];

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#4338ca', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #312e81, #6366f1)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                    <LayoutGrid size={42} color="#fff" />
                    <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Strategic thinking</h1>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Long-term goals, mental models, and decision frameworks.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {strategies.map((item, idx) => (
                    <motion.div key={idx} whileHover={{ y: -4, borderColor: '#555' }} style={{ backgroundColor: '#202020', borderRadius: '12px', padding: '24px', border: '1px solid #333', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>{item.title}</h3>
                        <p style={{ fontSize: '14px', color: '#a3a3a3', lineHeight: '1.5', marginBottom: '20px' }}>{item.desc}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 8px', borderRadius: '4px' }}>Impact: {item.impact}</span>
                            <span style={{ fontSize: '12px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '4px 8px', borderRadius: '4px' }}>Effort: {item.effort}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
};
export default StrategicThinking;
