import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Trash2, Edit2, Clock, ChefHat, Loader2, Search, X } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';
import { recipeApi, binApi, heroImageApi } from '../utils/api';

const RecipeBook = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Recipes');
    const [heroImage, setHeroImage] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useEffect(() => {
        fetchHeroImage();
        fetchRecipes();
    }, []);

    const fetchHeroImage = async () => {
        try {
            const data = await heroImageApi.get('recipes');
            if (data.image) {
                setHeroImage(data.image);
            }
        } catch (err) {
            console.error('Failed to fetch hero image:', err);
        }
    };

    const fetchRecipes = async () => {
        setIsLoading(true);
        try {
            const data = await recipeApi.getAll();
            setEntries(data || []);
        } catch (err) {
            console.error('Failed to fetch recipes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            try {
                await binApi.moveToBin('recipes', itemToDelete);
                await recipeApi.delete(id);
                setEntries(entries.filter(entry => entry.id !== id));
            } catch (err) {
                console.error('Failed to delete recipe:', err);
                alert('Failed to delete recipe');
            }
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/recipes/new', { state: { entry } });
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return '#22c55e';
            case 'Medium': return '#eab308';
            case 'Hard': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const getTotalTime = (prepTime, cookTime) => {
        if (!prepTime && !cookTime) return 'N/A';
        if (!cookTime || cookTime === '0m') return prepTime;
        return `${prepTime} + ${cookTime}`;
    };

    // Filter recipes based on active category and search query
    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (Array.isArray(entry.tags) && entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
        
        let matchesCategory = true;
        if (activeCategory !== 'All Recipes') {
            matchesCategory = entry.tags && entry.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase());
        }
        
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#15803d', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="recipes" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #14532d, #4ade80)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <CheckSquare size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Recipe Book</h1>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {isSearchVisible ? (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    placeholder="Search recipes..." 
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
                            onClick={() => navigate('/recipes/new')}
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
                            <Plus size={18} /> New Recipe
                        </button>
                    </div>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Culinary experiments and favorite dishes.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', overflowX: 'auto' }}>
                {['All Recipes', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'].map((tab) => (
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
                    <CheckSquare size={48} color="#333" style={{ marginBottom: '15px' }} />
                    <p style={{ fontSize: '18px', margin: 0 }}>No recipes found</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>{searchQuery ? 'Try a different search term' : 'Add a new recipe to build your cookbook'}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
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

                            {/* Recipe Image */}
                            {item.coverImage && (
                                <div style={{
                                    width: '100%',
                                    height: '180px',
                                    backgroundColor: '#1a1a1a',
                                    backgroundImage: `url(${item.coverImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '8px',
                                    marginBottom: '16px'
                                }} />
                            )}

                            <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', marginBottom: '12px', paddingRight: '60px' }}>{item.title}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '14px', color: '#a3a3a3' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={14} />
                                    <span>{getTotalTime(item.prepTime, item.cookTime)}</span>
                                </div>
                                <span>•</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ChefHat size={14} />
                                    <span style={{ color: getDifficultyColor(item.difficulty) }}>{item.difficulty}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {(item.tags || []).map(t => (
                                    <span key={t} style={{ fontSize: '11px', color: '#888', border: '1px solid #333', padding: '2px 6px', borderRadius: '4px' }}>#{t}</span>
                                ))}
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

export default RecipeBook;
