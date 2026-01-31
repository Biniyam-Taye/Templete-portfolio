import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus, Trash2, Edit2, ExternalLink } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const CourseList = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Courses');
    const [heroImage, setHeroImage] = useState(null);

    useEffect(() => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.courses) {
            setHeroImage(heroImages.courses);
        }
    }, []);

    const mockCourses = [
        { id: 'mock-1', title: "Advanced React Patterns", platform: "Frontend Masters", progress: 80, status: "In Progress" },
        { id: 'mock-2', title: "Rust for Beginners", platform: "Udemy", progress: 15, status: "In Progress" },
        { id: 'mock-3', title: "UI/UX Design Fundamentals", platform: "Coursera", progress: 100, status: "Completed" },
        { id: 'mock-4', title: "System Design Interview", platform: "Youtube", progress: 45, status: "In Progress" },
    ];

    const [entries, setEntries] = useState(mockCourses);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('course_entries') || '[]');
        if (savedEntries.length > 0) {
            setEntries([...savedEntries, ...mockCourses]);
        }
    }, []);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this course?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);

            // Move to Bin
            if (itemToDelete) {
                const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                binItems.unshift({
                    id: Date.now(),
                    source: 'courses',
                    deletedAt: new Date().toISOString(),
                    data: itemToDelete
                });
                localStorage.setItem('bin_items', JSON.stringify(binItems));
            }

            const userEntries = updatedEntries.filter(ent => typeof ent.id === 'number');
            localStorage.setItem('course_entries', JSON.stringify(userEntries));
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/courses/new', { state: { entry } });
    };

    const handleCardClick = (entry) => {
        if (entry.url) {
            window.open(entry.url, '_blank');
        }
    };

    // Filter courses based on active category
    const filteredEntries = activeCategory === 'All Courses'
        ? entries
        : entries.filter(entry => entry.status === activeCategory);

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#0369a1', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="courses" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #075985, #38bdf8)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <Globe size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Course List</h1>
                    </div>

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
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Continuous learning and skill acquisition.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
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
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        {tab}
                    </span>
                ))}
            </div>

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
                            {item.url && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); window.open(item.url, '_blank'); }}
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
                                {item.instructor && <span> • {item.instructor}</span>}
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

            {filteredEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                    <p style={{ fontSize: '18px' }}>No courses found in this category.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Try selecting a different category or add a new course.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default CourseList;
