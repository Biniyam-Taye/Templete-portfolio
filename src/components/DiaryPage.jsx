import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, ArrowUpDown, ChevronDown,
    Smile, PenTool, Trash2, Edit2
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const DiaryPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('June');
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.diary) {
            setHeroImage(heroImages.diary);
        }
    }, []);

    const mockEntries = [
        {
            id: 'mock-1',
            day: "1 June 2022",
            weekday: "Wednesday",
            title: "Reflections & Systems",
            content: [
                "Video call with nieces",
                "Too many meetings",
                "Great conversations with my dog",
                "Every breath a new beginning"
            ],
            tags: ["Family", "Work"]
        },
        {
            id: 'mock-2',
            day: "2 June 2023",
            weekday: "Thursday",
            title: "Sensory Overload",
            content: [
                "Fresh cherries from the market",
                "Waking up in the night with hunger",
                "Long summer evenings",
                "Hot water and cold water are just water"
            ],
            tags: ["Food", "Summer"]
        },
        {
            id: 'mock-3',
            day: "3 June 2023",
            weekday: "Friday",
            title: "Coffee & Anxiety",
            content: [
                "Conversing with a stranger",
                "Worrying about sleep",
                "Allergy medication",
                "The words come more easily when you're not caffeinated"
            ],
            tags: ["Social", "Health"]
        },
        {
            id: 'mock-4',
            day: "4 June 2022",
            weekday: "Saturday",
            title: "Slow Living",
            content: [
                "Not getting outside",
                "Letting myself sleep in",
                "Long summer days",
                "Reading three chapters of sci-fi"
            ],
            tags: ["Rest", "Reading"]
        },
        {
            id: 'mock-5',
            day: "5 June 2023",
            weekday: "Sunday",
            title: "Domestic Bliss",
            content: [
                "Buying flowers for mom",
                "Scrolling social media",
                "Morning cuddles",
                "Cleaning the workspace"
            ],
            tags: ["Home", "Family"]
        },
        {
            id: 'mock-6',
            day: "6 June 2023",
            weekday: "Monday",
            title: "Deep Work",
            content: [
                "Fixed the navigation bug",
                "Reviewing pull requests",
                "Need to buy new headphones",
                "Focus mode: ON"
            ],
            tags: ["Dev", "Work"]
        }
    ];

    const [entries, setEntries] = useState(mockEntries);

    React.useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
        if (savedEntries.length > 0) {
            setEntries([...savedEntries, ...mockEntries]);
        }
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this entry?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);

            // Move to Bin
            if (itemToDelete) {
                const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                binItems.unshift({
                    id: Date.now(),
                    source: 'diary',
                    deletedAt: new Date().toISOString(),
                    data: itemToDelete
                });
                localStorage.setItem('bin_items', JSON.stringify(binItems));
            }

            const userEntries = updatedEntries.filter(ent => typeof ent.id === 'number');
            localStorage.setItem('diary_entries', JSON.stringify(userEntries));
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/diary/new', { state: { entry } });
    };

    return (
        <DashboardLayout>
            {/* Banner Image */}
            <div className="diary-banner" style={{
                width: '100%',
                height: '280px',
                backgroundColor: '#f59e0b',
                borderRadius: '8px',
                marginBottom: '30px',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: heroImage ? `url(${heroImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <HeroImageUploader
                    pageKey="diary"
                    currentImage={heroImage}
                    onImageChange={setHeroImage}
                />
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #d97706, #fbbf24)',
                    opacity: 0.8,
                    position: 'relative'
                }}>
                    {/* Decorative diary pages */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '340px',
                        height: '200px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        display: 'flex'
                    }}>
                        <div style={{ flex: 1, borderRight: '2px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '20px', padding: '25px' }}>
                            <div style={{ width: '80%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                            <div style={{ width: '90%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                            <div style={{ width: '85%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', padding: '25px' }}>
                            <div style={{ width: '80%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                            <div style={{ width: '90%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Title Area */}
            <div className="diary-header" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                    <PenTool size={42} color="#fff" />
                    <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Daily journal</h1>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px', maxWidth: '800px', lineHeight: 1.6 }}>
                    The act of thinking about my life and writing it down each day
                </p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Set</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Object type: Diary Entry</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="diary-filters" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                borderBottom: '1px solid #333',
                paddingBottom: '15px'
            }}>
                <div className="diary-tabs" style={{ display: 'flex', gap: '32px', fontSize: '16px', color: '#888', fontWeight: 500 }}>
                    {['June', 'May', 'April', 'March', 'February'].map(month => (
                        <span
                            key={month}
                            style={{
                                color: activeTab === month ? '#fff' : '#888',
                                borderBottom: activeTab === month ? '2px solid #fff' : 'none',
                                paddingBottom: '15px',
                                marginBottom: '-16px', // Align border
                                cursor: 'pointer',
                                transition: 'color 0.2s'
                            }}
                            onClick={() => setActiveTab(month)}
                        >
                            {month}
                        </span>
                    ))}
                </div>

                {/* Mobile Dropdown for Months */}
                <div className="diary-mobile-dropdown">
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            background: '#202020',
                            color: '#fff',
                            border: '1px solid #333',
                            fontSize: '16px',
                            outline: 'none',
                            appearance: 'none', // Remove default arrow if desired, or keep
                            cursor: 'pointer'
                        }}
                    >
                        {['June', 'May', 'April', 'March', 'February'].map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    <ChevronDown size={20} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#fff', zIndex: 10 }} />
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ padding: '8px', cursor: 'pointer', color: '#888', transition: 'color 0.2s' }}><Filter size={18} /></div>
                    <div style={{ padding: '8px', cursor: 'pointer', color: '#888', transition: 'color 0.2s' }}><ArrowUpDown size={18} /></div>
                    <div style={{ padding: '8px', cursor: 'pointer', color: '#888', transition: 'color 0.2s' }}><Search size={18} /></div>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#333', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}>
                        <Smile size={16} color="#888" />
                    </div>
                    <button
                        onClick={() => navigate('/diary/new')}
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
                        }}>
                        New
                    </button>
                </div>
            </div>

            {/* Card Grid */}
            <div className="diary-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {entries.map((entry, idx) => (
                    <motion.div
                        key={entry.id || idx}
                        whileHover={{ y: -4, borderColor: '#555' }}
                        style={{
                            backgroundColor: '#202020',
                            borderRadius: '12px',
                            padding: '0', // Remove padding from container to let image bleed
                            overflow: 'hidden', // Ensure image clips
                            border: '1px solid #333',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            minHeight: '180px',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            position: 'relative'
                        }}
                        className="journal-card"
                    >
                        {/* Edit/Delete Actions - Absolute Top Right */}
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 10 }}>
                            <button
                                onClick={(e) => handleEdit(e, entry)}
                                style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#999', backdropFilter: 'blur(4px)' }}
                                onMouseEnter={(e) => e.target.style.color = '#fff'}
                                onMouseLeave={(e) => e.target.style.color = '#999'}
                                title="Edit"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, entry.id)}
                                style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#999', backdropFilter: 'blur(4px)' }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = '#999'}
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {entry.coverImage && (
                            <div style={{ width: '100%', height: '140px', overflow: 'hidden' }}>
                                <img src={entry.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#e5e5e5', marginBottom: '8px' }}>
                                {entry.day}
                            </div>
                            <div style={{ fontSize: '13px', color: '#ca8a04', marginBottom: '16px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                {entry.weekday}
                            </div>

                            {/* Title if present (new entries have title) */}
                            {entry.title && (
                                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
                                    {entry.title}
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                {entry.content.map((line, i) => (
                                    <div key={i} style={{ fontSize: '14px', color: '#a3a3a3', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <span style={{ color: '#444', marginTop: '4px' }}>•</span> {line}
                                    </div>
                                ))}
                            </div>

                            {/* Optional Tags line */}
                            <div style={{ marginTop: '25px', display: 'flex', gap: '8px' }}>
                                {entry.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '100px', color: '#888', border: '1px solid rgba(255,255,255,0.05)' }}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <style>{`
                /* Default Desktop Styles */
                .diary-mobile-dropdown {
                    display: none;
                }

                @media (max-width: 768px) {
                    .diary-banner {
                        height: 200px !important;
                        margin-bottom: 20px !important;
                    }
                    .diary-header h1 {
                        font-size: 32px !important;
                    }
                    /* Filters Stack */
                    .diary-filters {
                        flex-direction: column !important;
                        align-items: stretch !important; /* Stretch to fill width */
                        gap: 15px !important;
                    }
                    /* Hide Desktop Tabs on Mobile */
                    .diary-tabs {
                        display: none !important;
                    }
                    /* Show Mobile Dropdown */
                    .diary-mobile-dropdown {
                        display: block !important;
                        position: relative;
                        width: 100%;
                    }
                    
                    .diary-filters > div:last-child {
                        width: 100%;
                        justify-content: space-between;
                    }
                    /* Grid single column */
                    .diary-grid {
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                    }
                    /* Decorative hidden or scaled on mobile */
                    div[style*="width: 340px"] {
                        width: 280px !important;
                        height: 160px !important;
                        opacity: 0.5;
                    }
                }
            `}</style>
        </DashboardLayout >
    );
};

export default DiaryPage;
