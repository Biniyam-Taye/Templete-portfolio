import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Plus, Trash2, Edit2, Target, Zap } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const StrategicThinking = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Strategies');
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.strategy) {
            setHeroImage(heroImages.strategy);
        }
    }, []);

    const mockStrategies = [
        { id: 'mock-1', title: "Q3 Career Goals", impact: "High", effort: "Medium", desc: "Focus on networking and certification.", category: "Career" },
        { id: 'mock-2', title: "Side Project Pivot", impact: "Medium", effort: "High", desc: "Refactoring the backend for scalability.", category: "Business" },
        { id: 'mock-3', title: "Financial Freedom Plan", impact: "High", effort: "High", desc: "Investment diversification strategy.", category: "Finance" },
        { id: 'mock-4', title: "Minimalist Lifestyle", impact: "Low", effort: "Medium", desc: "Decluttering digital and physical space.", category: "Personal" },
    ];

    const [entries, setEntries] = useState(mockStrategies);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('strategy_entries') || '[]');
        if (savedEntries.length > 0) {
            setEntries([...savedEntries, ...mockStrategies]);
        }
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this strategy?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);

            // Move to Bin
            if (itemToDelete) {
                const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                binItems.unshift({
                    id: Date.now(),
                    source: 'strategy',
                    deletedAt: new Date().toISOString(),
                    data: itemToDelete
                });
                localStorage.setItem('bin_items', JSON.stringify(binItems));
            }

            const userEntries = updatedEntries.filter(ent => typeof ent.id === 'number');
            localStorage.setItem('strategy_entries', JSON.stringify(userEntries));
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/strategy/new', { state: { entry } });
    };

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'Low': return '#22c55e';
            case 'Medium': return '#eab308';
            case 'High': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getEffortColor = (effort) => {
        switch (effort) {
            case 'Low': return '#22c55e';
            case 'Medium': return '#eab308';
            case 'High': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    // Filter strategies based on active category
    const filteredEntries = activeCategory === 'All Strategies'
        ? entries
        : entries.filter(entry => entry.category === activeCategory);

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#4338ca', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="strategy" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #312e81, #6366f1)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <LayoutGrid size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Strategic Thinking</h1>
                    </div>

                    <button
                        onClick={() => navigate('/strategy/new')}
                        style={{
                            backgroundColor: '#fff',
                            color: 'black',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
                        }}
                    >
                        <Plus size={18} /> New Strategy
                    </button>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Long-term goals, mental models, and decision frameworks.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', flexWrap: 'wrap' }}>
                {['All Strategies', 'Career', 'Finance', 'Health', 'Personal', 'Business'].map((tab) => (
                    <span
                        key={tab}
                        onClick={() => setActiveCategory(tab)}
                        style={{
                            color: activeCategory === tab ? '#fff' : '#666',
                            cursor: 'pointer',
                            fontWeight: 500,
                            paddingBottom: '15px',
                            borderBottom: activeCategory === tab ? '2px solid #fff' : 'none',
                            marginBottom: '-17px',
                            transition: 'all 0.2s',
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        {tab}
                    </span>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filteredEntries.map((item, idx) => (
                    <motion.div
                        key={item.id || idx}
                        whileHover={{ y: -4, borderColor: '#555' }}
                        style={{
                            backgroundColor: '#202020',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid #333',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                    >
                        {/* Edit/Delete Actions */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px', zIndex: 10 }}>
                            <button
                                onClick={(e) => handleEdit(e, item)}
                                style={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(4px)' }}
                                title="Edit"
                            >
                                <Edit2 size={12} />
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, item.id)}
                                style={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#ef4444', backdropFilter: 'blur(4px)' }}
                                title="Delete"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', marginBottom: '12px', paddingRight: '60px' }}>{item.title}</h3>
                        <p style={{ fontSize: '14px', color: '#a3a3a3', lineHeight: '1.5', marginBottom: '20px' }}>{item.desc || item.description}</p>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{
                                fontSize: '12px',
                                background: `${getImpactColor(item.impact)}20`,
                                color: getImpactColor(item.impact),
                                padding: '4px 10px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 500
                            }}>
                                <Target size={12} /> Impact: {item.impact}
                            </span>
                            <span style={{
                                fontSize: '12px',
                                background: `${getEffortColor(item.effort)}20`,
                                color: getEffortColor(item.effort),
                                padding: '4px 10px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 500
                            }}>
                                <Zap size={12} /> Effort: {item.effort}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                    <p style={{ fontSize: '18px' }}>No strategies found in this category.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Try selecting a different category or add a new strategy.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StrategicThinking;
