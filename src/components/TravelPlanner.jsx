import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, Trash2, Edit2, MapPin, Calendar } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const TravelPlanner = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Trips');
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.travel) {
            setHeroImage(heroImages.travel);
        }
    }, []);

    const mockTrips = [
        { id: 'mock-1', title: "Japan Trip", destination: "Tokyo, Japan", startDate: "2024-04-15", status: "Planning", coverImage: null, gradient: "linear-gradient(135deg, #f9a8d4, #f472b6)" },
        { id: 'mock-2', title: "Weekend Getaway", destination: "Bali, Indonesia", startDate: "2024-03-01", status: "Booked", coverImage: null, gradient: "linear-gradient(135deg, #4ade80, #22c55e)" },
        { id: 'mock-3', title: "Eurotrip", destination: "Paris, France", startDate: "2025-06-01", status: "Idea", coverImage: null, gradient: "linear-gradient(135deg, #60a5fa, #3b82f6)" },
    ];

    const [entries, setEntries] = useState(mockTrips);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('travel_entries') || '[]');
        if (savedEntries.length > 0) {
            setEntries([...savedEntries, ...mockTrips]);
        }
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this trip?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);

            // Move to Bin
            if (itemToDelete) {
                const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                binItems.unshift({
                    id: Date.now(),
                    source: 'travel',
                    deletedAt: new Date().toISOString(),
                    data: itemToDelete
                });
                localStorage.setItem('bin_items', JSON.stringify(binItems));
            }

            const userEntries = updatedEntries.filter(ent => typeof ent.id === 'number');
            localStorage.setItem('travel_entries', JSON.stringify(userEntries));
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

    // Filter trips based on active category
    const filteredEntries = activeCategory === 'All Trips'
        ? entries
        : entries.filter(entry => entry.status === activeCategory);

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#0d9488', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="travel" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #115e59, #2dd4bf)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <Map size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Travel Planner</h1>
                    </div>

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
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Itineraries, bookings, and dream destinations.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', flexWrap: 'wrap' }}>
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

                            {item.startDate && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                                    <Calendar size={14} />
                                    <span>{new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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

            {filteredEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                    <p style={{ fontSize: '18px' }}>No trips found in this category.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Try selecting a different category or plan a new trip.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TravelPlanner;
