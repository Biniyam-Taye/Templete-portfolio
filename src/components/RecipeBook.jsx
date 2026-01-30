import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const RecipeBook = () => {
    const recipes = [
        { title: "Sourdough Bread", time: "24h", tags: ["Baking"], diff: "Hard" },
        { title: "Pasta Carbonara", time: "20m", tags: ["Dinner"], diff: "Medium" },
        { title: "Green Smoothie", time: "5m", tags: ["Breakfast"], diff: "Easy" },
        { title: "Miso Soup", time: "15m", tags: ["Lunch"], diff: "Easy" },
    ];

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#15803d', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #14532d, #4ade80)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                    <CheckSquare size={42} color="#fff" />
                    <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Recipe book</h1>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Culinary experiments and favorite dishes.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {recipes.map((item, idx) => (
                    <motion.div key={idx} whileHover={{ y: -4, borderColor: '#555' }} style={{ backgroundColor: '#202020', borderRadius: '12px', padding: '24px', border: '1px solid #333', cursor: 'pointer' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{item.title}</h3>
                        <div style={{ marginTop: '10px', fontSize: '14px', color: '#a3a3a3' }}>Time: {item.time} • Difficulty: {item.diff}</div>
                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>{item.tags.map(t => <span key={t} style={{ fontSize: '11px', color: '#888', border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}>#{t}</span>)}</div>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
};
export default RecipeBook;
