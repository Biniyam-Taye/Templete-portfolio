import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Filter, ArrowUpDown, Search, Trash2, Edit2, Plus } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const MovieDatabase = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Movies');
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.movies) {
            setHeroImage(heroImages.movies);
        }
    }, []);

    const mockMovies = [
        { id: 'mock-1', title: "Everything Everywhere All At Once", rating: "5", genre: "Sci-Fi", status: "Watched", watched: "2023", coverImage: null },
        { id: 'mock-2', title: "Dune: Part Two", rating: "4.8", genre: "Sci-Fi", status: "Watched", watched: "2024", coverImage: null },
        { id: 'mock-3', title: "Past Lives", rating: "5", genre: "Romance", status: "Watched", watched: "2023", coverImage: null },
        { id: 'mock-4', title: "Oppenheimer", rating: "4.5", genre: "Biography", status: "Watched", watched: "2023", coverImage: null },
    ];

    const [entries, setEntries] = useState(mockMovies);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('movie_entries') || '[]');
        if (savedEntries.length > 0) {
            setEntries([...savedEntries, ...mockMovies]);
        }
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this movie?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);

            // Move to Bin
            if (itemToDelete) {
                const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                binItems.unshift({
                    id: Date.now(),
                    source: 'movies',
                    deletedAt: new Date().toISOString(),
                    data: itemToDelete
                });
                localStorage.setItem('bin_items', JSON.stringify(binItems));
            }

            const userEntries = updatedEntries.filter(ent => typeof ent.id === 'number');
            localStorage.setItem('movie_entries', JSON.stringify(userEntries));
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/movies/new', { state: { entry } });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Watched': return '#22c55e';
            case 'Watching': return '#eab308';
            case 'Watchlist': return '#3b82f6';
            case 'Dropped': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    // Filter movies based on active category
    const filteredEntries = activeCategory === 'All Movies'
        ? entries
        : entries.filter(entry => {
            if (activeCategory === 'Favorites') {
                return parseFloat(entry.rating) >= 4.5;
            }
            return entry.status === activeCategory;
        });

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#be123c', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="movies" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #9f1239, #fb7185)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <FileText size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Movie Database</h1>
                    </div>

                    <button
                        onClick={() => navigate('/movies/new')}
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
                        <Plus size={18} /> New Movie
                    </button>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>A collection of films watched and to watch.</p>
            </div>

            {/* Filter Tabs - Now Clickable */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                {['All Movies', 'Watched', 'Watchlist', 'Favorites'].map((tab) => (
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
                {filteredEntries.map((item, idx) => (
                    <motion.div
                        key={item.id || idx}
                        whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                        style={{
                            backgroundColor: '#202020',
                            borderRadius: '12px',
                            border: '1px solid #333',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Edit/Delete Actions */}
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px', zIndex: 10 }}>
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

                        {/* Poster Image */}
                        <div style={{
                            width: '100%',
                            aspectRatio: '2/3',
                            backgroundColor: '#333',
                            backgroundImage: item.coverImage ? `url(${item.coverImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {!item.coverImage && <span style={{ fontSize: '40px', opacity: 0.1 }}>🎬</span>}
                        </div>

                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', marginBottom: '8px', lineHeight: '1.4' }}>{item.title}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <span style={{ fontSize: '12px', color: getStatusColor(item.status), background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px' }}>
                                    {item.status || 'Watched'}
                                </span>
                                {item.rating > 0 && (
                                    <span style={{ fontSize: '12px', color: '#fbbf24' }}>★ {item.rating}</span>
                                )}
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888' }}>
                                <span>{item.genre}</span>
                                <span>{new Date(item.watchDate || item.watched || Date.now()).getFullYear()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                    <p style={{ fontSize: '18px' }}>No movies found in this category.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Try selecting a different category or add a new movie.</p>
                </div>
            )}
        </DashboardLayout>
    );
};
export default MovieDatabase;
