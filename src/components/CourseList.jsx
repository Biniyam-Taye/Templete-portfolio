import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus, Trash2, Edit2, ExternalLink, Loader2, Search, X } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';
import { courseApi, binApi, heroImageApi } from '../utils/api';

const CourseList = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Courses');
    const [heroImage, setHeroImage] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useEffect(() => {
        fetchHeroImage();
        fetchCourses();
    }, []);

    const fetchHeroImage = async () => {
        try {
            const data = await heroImageApi.get('courses');
            if (data.image) {
                setHeroImage(data.image);
            }
        } catch (err) {
            console.error('Failed to fetch hero image:', err);
        }
    };

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const data = await courseApi.getAll();
            setEntries(data || []);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this course?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            try {
                await binApi.moveToBin('courses', itemToDelete);
                await courseApi.delete(id);
                setEntries(entries.filter(entry => entry.id !== id));
            } catch (err) {
                console.error('Failed to delete course:', err);
                alert('Failed to delete course');
            }
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/courses/new', { state: { entry } });
    };

    const handleCardClick = (entry) => {
        if (entry.link) {
            window.open(entry.link, '_blank');
        }
    };

    // Filter courses based on active category and search query
    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             entry.platform?.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesCategory = true;
        if (activeCategory !== 'All Courses') {
            matchesCategory = entry.status === activeCategory;
        }
        
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#0369a1', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="courses" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #075985, #38bdf8)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Globe size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Course List</h1>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {isSearchVisible ? (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    placeholder="Search courses..." 
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
                            onClick={() => navigate('/courses/new')}
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
                            <Plus size={18} /> New Course
                        </button>
                    </div>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Continuous learning and skill acquisition.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', overflowX: 'auto' }}>
                {['All Courses', 'In Progress', 'Completed', 'Not Started'].map((tab) => (
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
                    <Globe size={48} color="#333" style={{ marginBottom: '15px' }} />
                    <p style={{ fontSize: '18px', margin: 0 }}>No courses found</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>{searchQuery ? 'Try a different search term' : 'Add a new course to your list'}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredEntries.map((item, idx) => (
                        <motion.div
                            key={item.id || idx}
                            whileHover={{ x: 4, borderColor: '#555' }}
                            style={{
                                backgroundColor: '#202020',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid #333',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                position: 'relative'
                            }}
                            onClick={() => handleCardClick(item)}
                        >
                            {/* Edit/Delete Actions */}
                            <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px', zIndex: 10 }}>
                                {item.link && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); window.open(item.link, '_blank'); }}
                                        style={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#38bdf8', backdropFilter: 'blur(4px)' }}
                                        title="Open Course"
                                    >
                                        <ExternalLink size={12} />
                                    </button>
                                )}
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

                            <div style={{ flex: 1, paddingRight: '200px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', marginBottom: '6px' }}>{item.title}</h3>
                                <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                                    {item.platform}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '120px', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${item.progress}%`, height: '100%', background: item.progress === 100 ? '#22c55e' : '#38bdf8' }}></div>
                                </div>
                                <span style={{ fontSize: '13px', color: '#ccc', width: '40px', textAlign: 'right', fontWeight: 600 }}>{item.progress}%</span>
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

export default CourseList;
