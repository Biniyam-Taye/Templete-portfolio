import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Filter, Search, Trash2, Edit2, Plus, Loader2, X } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';
import { movieApi, binApi, heroImageApi } from '../utils/api';

const MovieDatabase = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Movies');
    const [heroImage, setHeroImage] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useEffect(() => {
        fetchHeroImage();
        fetchMovies();
    }, []);

    const fetchHeroImage = async () => {
        try {
            const data = await heroImageApi.get('movies');
            if (data.image) {
                setHeroImage(data.image);
            }
        } catch (err) {
            console.error('Failed to fetch hero image:', err);
        }
    };

    const fetchMovies = async () => {
        setIsLoading(true);
        try {
            const data = await movieApi.getAll();
            setEntries(data || []);
        } catch (err) {
            console.error('Failed to fetch movies:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this movie?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            try {
                await binApi.moveToBin('movies', itemToDelete);
                await movieApi.delete(id);
                setEntries(entries.filter(entry => entry.id !== id));
            } catch (err) {
                console.error('Failed to delete movie:', err);
                alert('Failed to delete movie');
            }
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

    // Filter movies based on active category and search query
    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             entry.genre?.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesCategory = true;
        if (activeCategory === 'Favorites') {
            matchesCategory = parseFloat(entry.rating) >= 4.5;
        } else if (activeCategory !== 'All Movies') {
            matchesCategory = entry.status === activeCategory;
        }
        
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#be123c', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="movies" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #9f1239, #fb7185)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <FileText size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Movie Database</h1>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {isSearchVisible ? (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    placeholder="Search movies..." 
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
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>A collection of films watched and to watch.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', overflowX: 'auto' }}>
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
                    <FileText size={48} color="#333" style={{ marginBottom: '15px' }} />
                    <p style={{ fontSize: '18px', margin: 0 }}>No movies found</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>{searchQuery ? 'Try a different search term' : 'Add a new movie to build your database'}</p>
                </div>
            ) : (
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
                                backgroundColor: '#1a1a1a',
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
                                    <span style={{ fontSize: '12px', color: getStatusColor(item.status), background: `${getStatusColor(item.status)}15`, padding: '3px 8px', borderRadius: '4px' }}>
                                        {item.status || 'Watched'}
                                    </span>
                                    {item.rating > 0 && (
                                        <span style={{ fontSize: '12px', color: '#fbbf24' }}>★ {item.rating}</span>
                                    )}
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888' }}>
                                    <span>{item.genre}</span>
                                    <span>{item.watched ? new Date(item.watched).getFullYear() : 'N/A'}</span>
                                </div>
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
export default MovieDatabase;
