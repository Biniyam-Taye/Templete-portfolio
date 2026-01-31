import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Filter, ArrowUpDown, Search, Trash2, Edit2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const ExperimentalMe = () => {
    const navigate = useNavigate();

    const mockExperiments = [
        {
            id: 'mock-1',
            title: "No Sugar Challenge",
            status: "Completed",
            tags: ["Health", "Diet"],
            notes: "Lasted 30 days. Energy levels stable."
        },
        {
            id: 'mock-2',
            title: "Morning Pages",
            status: "In Progress",
            tags: ["Writing", "Mindfulness"],
            notes: "Writing 3 pages every morning."
        },
        {
            id: 'mock-3',
            title: "Learn Rust",
            status: "Planned",
            tags: ["Dev", "Skill"],
            notes: "Start with the official book."
        },
        {
            id: 'mock-4',
            title: "Meditation Streak",
            status: "Failed",
            tags: ["Mindfulness"],
            notes: "Stopped after 5 days."
        },
    ];

    const [entries, setEntries] = useState(mockExperiments);
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('experimental_entries') || '[]');
        if (savedEntries.length > 0) {
            setEntries([...savedEntries, ...mockExperiments]);
        }

        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.experimental) {
            setHeroImage(heroImages.experimental);
        }
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this experiment?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);

            // Move to Bin
            if (itemToDelete) {
                const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                binItems.unshift({
                    id: Date.now(),
                    source: 'experimental',
                    deletedAt: new Date().toISOString(),
                    data: itemToDelete
                });
                localStorage.setItem('bin_items', JSON.stringify(binItems));
            }

            // Persist deletion for user entries
            const userEntries = updatedEntries.filter(ent => typeof ent.id === 'number');
            localStorage.setItem('experimental_entries', JSON.stringify(userEntries));
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/experimental-me/new', { state: { entry } });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#22c55e';
            case 'In Progress': return '#eab308';
            case 'Failed': return '#ef4444';
            default: return '#94a3b8'; // Planned
        }
    };

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#4f46e5', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="experimental" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #4338ca, #818cf8)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <Star size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Experimental Me</h1>
                    </div>

                    {/* Header Actions */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ padding: '8px', cursor: 'pointer', color: '#888' }}><Filter size={18} /></div>
                        <div style={{ padding: '8px', cursor: 'pointer', color: '#888' }}><Search size={18} /></div>
                        <button
                            onClick={() => navigate('/experimental-me/new')}
                            style={{
                                backgroundColor: '#fff',
                                color: 'black',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginLeft: '12px'
                            }}
                        >
                            New Experiment
                        </button>
                    </div>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Tracking habits, challenges, and personal experiments.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {entries.map((item, idx) => (
                    <motion.div
                        key={item.id || idx}
                        whileHover={{ y: -4, borderColor: '#555' }}
                        style={{
                            backgroundColor: '#202020',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid #333',
                            cursor: 'pointer',
                            position: 'relative',
                            minHeight: '180px'
                        }}
                    >
                        {/* Edit/Delete Actions */}
                        <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px', zIndex: 10 }}>
                            <button
                                onClick={(e) => handleEdit(e, item)}
                                style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#999', backdropFilter: 'blur(4px)' }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#999'}
                                title="Edit"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, item.id)}
                                style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#999', backdropFilter: 'blur(4px)' }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = '#999'}
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', marginBottom: '8px', paddingRight: '60px' }}>{item.title}</h3>
                        <span style={{ fontSize: '13px', color: getStatusColor(item.status), background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{item.status}</span>
                        <span style={{ fontSize: '13px', color: getStatusColor(item.status), background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{item.status}</span>

                        {/* Notes Rendering */}
                        <div style={{ marginTop: '12px' }}>
                            {typeof item.notes === 'string' ? (
                                <p style={{ color: '#a3a3a3', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{item.notes}</p>
                            ) : Array.isArray(item.notes) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {item.notes.map((block, i) => {
                                        if (block.type === 'paragraph') return <p key={i} style={{ color: '#a3a3a3', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{block.content}</p>;
                                        if (block.type === 'bullet') return (
                                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'start', color: '#a3a3a3', fontSize: '14px', lineHeight: '1.5' }}>
                                                <span style={{ marginTop: '7px', minWidth: '5px', height: '5px', borderRadius: '50%', background: '#666' }}></span>
                                                <span>{block.content}</span>
                                            </div>
                                        );
                                        if (block.type === 'todo') return (
                                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#a3a3a3', fontSize: '14px' }}>
                                                <div style={{ minWidth: '14px', height: '14px', border: '1px solid #555', borderRadius: '3px', background: block.checked ? '#555' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {block.checked && <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '1px' }}></div>}
                                                </div>
                                                <span style={{ textDecoration: block.checked ? 'line-through' : 'none', opacity: block.checked ? 0.6 : 1 }}>{block.content}</span>
                                            </div>
                                        );
                                        if (block.type === 'toggle') return (
                                            <details key={i} style={{ color: '#a3a3a3', fontSize: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', padding: '8px' }}>
                                                <summary style={{ cursor: 'pointer', fontWeight: 500, color: '#d4d4d4', outline: 'none' }}>{block.title || 'Untitled Toggle'}</summary>
                                                <div style={{ paddingLeft: '16px', marginTop: '8px', color: '#999', lineHeight: '1.5', borderLeft: '2px solid #333', marginLeft: '4px' }}>
                                                    {block.content}
                                                </div>
                                            </details>
                                        );
                                        return null;
                                    })}
                                </div>
                            ) : null}
                        </div>

                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {(item.tags || []).map(t => (
                                <span key={t} style={{ fontSize: '11px', color: '#888', border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}>#{t}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
};
export default ExperimentalMe;
