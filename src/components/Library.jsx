import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Trash2, Edit2, Star, Calendar, User } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const Library = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Books');
    const [heroImage, setHeroImage] = useState(null);

    const mockBooks = [
        { id: 'mock-1', title: "Atomic Habits", author: "James Clear", status: "Reading", rating: 5, category: "Self-Help", dateAdded: "2024-01-15" },
        { id: 'mock-2', title: "The Design of Everyday Things", author: "Don Norman", status: "Completed", rating: 4, category: "Design", dateAdded: "2023-12-10" },
        { id: 'mock-3', title: "Sapiens", author: "Yuval Noah Harari", status: "To Read", rating: 0, category: "History", dateAdded: "2024-01-20" },
        { id: 'mock-4', title: "Clean Code", author: "Robert C. Martin", status: "Reading", rating: 5, category: "Programming", dateAdded: "2024-01-05" },
    ];

    const [entries, setEntries] = useState(mockBooks);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('library_entries') || '[]');
        if (savedEntries.length > 0) {
            setEntries([...savedEntries, ...mockBooks]);
        }

        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.library) {
            setHeroImage(heroImages.library);
        }
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this book?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);

            // Move to Bin
            if (itemToDelete) {
                const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                binItems.unshift({
                    id: Date.now(),
                    source: 'library',
                    deletedAt: new Date().toISOString(),
                    data: itemToDelete
                });
                localStorage.setItem('bin_items', JSON.stringify(binItems));
            }

            const userEntries = updatedEntries.filter(ent => typeof ent.id === 'number');
            localStorage.setItem('library_entries', JSON.stringify(userEntries));
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/library/new', { state: { entry } });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Reading': return '#3b82f6';
            case 'Completed': return '#22c55e';
            case 'To Read': return '#eab308';
            case 'On Hold': return '#94a3b8';
            default: return '#94a3b8';
        }
    };

    // Filter books based on active category
    const filteredEntries = activeCategory === 'All Books'
        ? entries
        : entries.filter(entry => entry.status === activeCategory);

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#7c3aed', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="library" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #6d28d9, #a78bfa)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <BookOpen size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Library</h1>
                    </div>

                    <button
                        onClick={() => navigate('/library/new')}
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
                        <Plus size={18} /> Add Book
                    </button>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Books I'm reading, have read, and want to read.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', flexWrap: 'wrap' }}>
                {['All Books', 'Reading', 'Completed', 'To Read', 'On Hold'].map((tab) => (
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
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

                        <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', marginBottom: '8px', paddingRight: '60px' }}>{item.title}</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#a3a3a3', marginBottom: '12px' }}>
                            <User size={14} />
                            <span>{item.author}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <span style={{
                                fontSize: '12px',
                                background: `${getStatusColor(item.status)}20`,
                                color: getStatusColor(item.status),
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontWeight: 500
                            }}>
                                {item.status}
                            </span>
                            {item.rating > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                                    <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 600 }}>{item.rating}</span>
                                </div>
                            )}
                        </div>

                        {item.category && (
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
                                {item.category}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                    <p style={{ fontSize: '18px' }}>No books found in this category.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Try selecting a different category or add a new book.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Library;
