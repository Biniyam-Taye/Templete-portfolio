import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, ArrowUpDown, ChevronDown,
    Smile, PenTool, Trash2, Edit2
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';
import { diaryApi, binApi } from '../utils/api';

const DiaryPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [heroImage, setHeroImage] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

    useEffect(() => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.diary) {
            setHeroImage(heroImages.diary);
        }
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const data = await diaryApi.getAll();
            setEntries(data || []);
        } catch (err) {
            console.error('Failed to fetch entries:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this entry?')) {
            const entryToDelete = entries.find(entry => entry.id === id);
            try {
                // Move to bin first
                await binApi.moveToBin('diary', entryToDelete);
                // Then delete from original
                await diaryApi.delete(id);
                setEntries(entries.filter(entry => entry.id !== id));
            } catch (err) {
                console.error('Failed to delete entry:', err);
                alert('Failed to delete entry');
            }
        }
    };


    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/diary/new', { state: { entry } });
    };

    const filteredEntries = entries
        .filter(entry => {
            const matchesTab = activeTab === 'All' || (entry.day && entry.day.includes(activeTab));
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery || 
                (entry.title && entry.title.toLowerCase().includes(searchLower)) ||
                (entry.content && Array.isArray(entry.content) && entry.content.some(line => line.toLowerCase().includes(searchLower))) ||
                (entry.day && entry.day.toLowerCase().includes(searchLower)) ||
                (entry.tags && Array.isArray(entry.tags) && entry.tags.some(tag => tag.toLowerCase().includes(searchLower)));
            
            return matchesTab && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.day || '1970-01-01');
            const dateB = new Date(b.day || '1970-01-01');
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

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
                <div className="diary-tabs" style={{ 
                    display: 'flex', 
                    gap: '24px', 
                    fontSize: '14px', 
                    color: '#888', 
                    fontWeight: 500,
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    paddingRight: '20px'
                }}>
                    {['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                        <span
                            key={month}
                            style={{
                                color: activeTab === month ? '#fff' : '#888',
                                borderBottom: activeTab === month ? '2px solid #fff' : 'none',
                                paddingBottom: '15px',
                                marginBottom: '-16px',
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                                paddingLeft: '4px',
                                paddingRight: '4px'
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
                            appearance: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    <ChevronDown size={20} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#fff', zIndex: 10 }} />
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isSearchVisible && (
                        <motion.input
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 200, opacity: 1 }}
                            type="text"
                            placeholder="Search entries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                background: '#1a1a1a',
                                border: '1px solid #333',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                    )}
                    <div 
                        onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                        style={{ padding: '8px', cursor: 'pointer', color: '#888', transition: 'color 0.2s' }}
                        title={`Sort: ${sortOrder === 'newest' ? 'Newest' : 'Oldest'}`}
                    >
                        <ArrowUpDown size={18} style={{ color: sortOrder === 'newest' ? '#fff' : '#888' }} />
                    </div>
                    <div 
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                        style={{ padding: '8px', cursor: 'pointer', color: isSearchVisible ? '#fff' : '#888', transition: 'color 0.2s' }}
                    >
                        <Search size={18} />
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
                {filteredEntries.map((entry, idx) => (
                        <motion.div
                            key={entry.id || idx}
                            whileHover={{ y: -4, borderColor: '#555' }}
                            style={{
                                backgroundColor: '#202020',
                                borderRadius: '12px',
                                padding: '0',
                                overflow: 'hidden',
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
                            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px', zIndex: 10 }}>
                                <button
                                    onClick={(e) => handleEdit(e, entry)}
                                    style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#999', backdropFilter: 'blur(4px)' }}
                                    title="Edit"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, entry.id)}
                                    style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#999', backdropFilter: 'blur(4px)' }}
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

                                {entry.title && (
                                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
                                        {entry.title}
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                    {(Array.isArray(entry.content) ? entry.content : []).map((line, i) => (
                                        <div key={i} style={{ fontSize: '14px', color: '#a3a3a3', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <span style={{ color: '#444', marginTop: '4px' }}>•</span> {line}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '25px', display: 'flex', gap: '8px' }}>
                                    {(entry.tags || []).map(tag => (
                                        <span key={tag} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '100px', color: '#888', border: '1px solid rgba(255,255,255,0.05)' }}>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
            </div>

            <style>{`
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
                    .diary-filters {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 15px !important;
                    }
                    .diary-tabs {
                        display: none !important;
                    }
                    .diary-mobile-dropdown {
                        display: block !important;
                        position: relative;
                        width: 100%;
                    }
                    
                    .diary-filters > div:last-child {
                        width: 100%;
                        justify-content: space-between;
                    }
                    .diary-grid {
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                    }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default DiaryPage;
