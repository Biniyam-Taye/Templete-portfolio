import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Plus, Trash2, Edit2, Clock, ChefHat } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const RecipeBook = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Recipes');
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.recipes) {
            setHeroImage(heroImages.recipes);
        }
    }, []);

    const mockRecipes = [
        { id: 'mock-1', title: "Sourdough Bread", prepTime: "30m", cookTime: "24h", tags: ["Baking"], difficulty: "Hard", coverImage: null },
        { id: 'mock-2', title: "Pasta Carbonara", prepTime: "10m", cookTime: "20m", tags: ["Dinner"], difficulty: "Medium", coverImage: null },
        { id: 'mock-3', title: "Green Smoothie", prepTime: "5m", cookTime: "0m", tags: ["Breakfast"], difficulty: "Easy", coverImage: null },
        { id: 'mock-4', title: "Miso Soup", prepTime: "5m", cookTime: "15m", tags: ["Lunch"], difficulty: "Easy", coverImage: null },
    ];

    const [entries, setEntries] = useState(mockRecipes);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('recipe_entries') || '[]');
        if (savedEntries.length > 0) {
            setEntries([...savedEntries, ...mockRecipes]);
        }
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);

            // Move to Bin
            if (itemToDelete) {
                const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                binItems.unshift({
                    id: Date.now(),
                    source: 'recipes',
                    deletedAt: new Date().toISOString(),
                    data: itemToDelete
                });
                localStorage.setItem('bin_items', JSON.stringify(binItems));
            }

            const userEntries = updatedEntries.filter(ent => typeof ent.id === 'number');
            localStorage.setItem('recipe_entries', JSON.stringify(userEntries));
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

    // Filter recipes based on active category
    const filteredEntries = activeCategory === 'All Recipes'
        ? entries
        : entries.filter(entry =>
            entry.tags && entry.tags.some(tag =>
                tag.toLowerCase() === activeCategory.toLowerCase()
            )
        );

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#15803d', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="recipes" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #14532d, #4ade80)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <CheckSquare size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Recipe Book</h1>
                    </div>

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
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Culinary experiments and favorite dishes.</p>
            </div>

            {/* Filter Tabs - Now Clickable */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
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
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        {tab}
                    </span>
                ))}
            </div>

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
                                backgroundColor: '#333',
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

            {filteredEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                    <p style={{ fontSize: '18px' }}>No recipes found in this category.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Try selecting a different category or add a new recipe.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default RecipeBook;
