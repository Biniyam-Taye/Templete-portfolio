import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, Trash2, Edit2, MapPin, Calendar, Loader2, Search, X } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';
import { travelApi, binApi, heroImageApi } from '../utils/api';

const TravelPlanner = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Trips');
    const [heroImage, setHeroImage] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useEffect(() => {
        fetchHeroImage();
        fetchTrips();
    }, []);

    const fetchHeroImage = async () => {
        try {
            const data = await heroImageApi.get('travel');
            if (data.image) {
                setHeroImage(data.image);
            }
        } catch (err) {
            console.error('Failed to fetch hero image:', err);
        }
    };

    const fetchTrips = async () => {
        setIsLoading(true);
        try {
            const data = await travelApi.getAll();
            setEntries(data || []);
        } catch (err) {
            console.error('Failed to fetch trips:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this trip?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            try {
                await binApi.moveToBin('travel', itemToDelete);
                await travelApi.delete(id);
                setEntries(entries.filter(entry => entry.id !== id));
            } catch (err) {
                console.error('Failed to delete trip:', err);
                alert('Failed to delete trip');
            }
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/travel/new', { state: { entry } });
    };

    const getStatusColor = (status) => {
        const colors = {
            'Idea': '#94a3b8',
            'Planning': '#3b82f6',
            'Booked': '#22c55e',
            'Completed': '#a855f7',
            'Cancelled': '#ef4444'
        };
        return colors[status] || '#94a3b8';
    };

    const getDefaultGradient = (index) => {
        const gradients = [
            "linear-gradient(135deg, #f9a8d4, #f472b6)",
            "linear-gradient(135deg, #4ade80, #22c55e)",
            "linear-gradient(135deg, #60a5fa, #3b82f6)",
            "linear-gradient(135deg, #c084fc, #a855f7)",
            "linear-gradient(135deg, #fbbf24, #f59e0b)",
            "linear-gradient(135deg, #2dd4bf, #14b8a6)"
        ];
        return gradients[index % gradients.length];
    };

    // Filter trips based on active category and search query
    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             entry.destination?.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesCategory = true;
        if (activeCategory !== 'All Trips') {
            matchesCategory = entry.status === activeCategory;
        }
        
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#0d9488', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="travel" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #115e59, #2dd4bf)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Map size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Travel Planner</h1>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {isSearchVisible ? (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    placeholder="Search trips..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '6px 30px 6px 12px', borderRadius: '6px', fontSize: '14px', outline: 'none', width: '200px' }}
                                />
                                <X size={16} color="#888" style={{ position: 'absolute', right: '10px', cursor: 'pointer' }} onClick={() => { setIsSearchVisible(false); setSearchQuery(''); }} />
                            </div>
                        ) : (
                            <div style={{ padding: '8px', cursor: 'pointer', color: '#888' }} onClick={() => setIsSearchVisible(true)}><Search size={18} /></div>
                        )}

                        <button
                            onClick={() => navigate('/travel/new')}
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
                            <Plus size={18} /> New Trip
                        </button>
                    </div>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Itineraries, bookings, and dream destinations.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', overflowX: 'auto' }}>
                {['All Trips', 'Idea', 'Planning', 'Booked', 'Completed'].map((tab) => (
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
                            fontFamily: "'Inter', sans-serif",
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </span>
                ))}
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                    <Loader2 className="animate-spin" size={48} color="#666" />
                </div>
            ) : filteredEntries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 20px', color: '#666', background: '#1a1a1a', borderRadius: '16px', border: '1px solid #333' }}>
                    <Map size={48} color="#333" style={{ marginBottom: '15px' }} />
                    <p style={{ fontSize: '18px', margin: 0 }}>No trips found</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>{searchQuery ? 'Try a different search term' : 'Start planning your next adventure'}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {filteredEntries.map((item, idx) => (
                        <motion.div
                            key={item.id || idx}
                            whileHover={{ y: -4, borderColor: '#555' }}
                            style={{
                                backgroundColor: '#202020',
                                borderRadius: '12px',
                                border: '1px solid #333',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            {/* Edit/Delete Actions */}
                            <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
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

                            {/* Cover Image or Gradient */}
                            <div style={{
                                height: '160px',
                                background: item.coverImage ? `url(${item.coverImage})` : (item.gradient || getDefaultGradient(idx)),
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '100%'
                            }}></div>

                            <div style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', marginBottom: '8px' }}>{item.title}</h3>

                                {item.destination && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#a3a3a3', marginBottom: '12px' }}>
                                        <MapPin size={14} />
                                        <span>{item.destination}</span>
                                    </div>
                                )}

                                {item.dates && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                                        <Calendar size={14} />
                                        <span>{item.dates}</span>
                                    </div>
                                )}

                                <span style={{
                                    fontSize: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    color: getStatusColor(item.status),
                                    border: `1px solid ${getStatusColor(item.status)}40`,
                                    display: 'inline-block'
                                }}>
                                    {item.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default TravelPlanner;
