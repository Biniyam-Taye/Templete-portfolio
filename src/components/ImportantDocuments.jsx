import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, File, Plus, Trash2, Edit2, Download, Eye, Loader2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';
import { documentApi, binApi } from '../utils/api';

const ImportantDocuments = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Documents');
    const [heroImage, setHeroImage] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.documents) {
            setHeroImage(heroImages.documents);
        }
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const data = await documentApi.getAll();
            setEntries(data || []);
        } catch (err) {
            console.error('Failed to fetch documents:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this document?')) {
            const documentToDelete = entries.find(entry => entry.id === id);
            try {
                // Move to bin first
                await binApi.moveToBin('documents', documentToDelete);
                // Then delete from original
                await documentApi.delete(id);
                setEntries(entries.filter(entry => entry.id !== id));
            } catch (err) {
                console.error('Failed to delete document:', err);
                alert('Failed to delete document');
            }
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/documents/new', { state: { entry } });
    };

    const handleView = (e, entry) => {
        e.stopPropagation();
        if (entry.fileUrl) {
            window.open(entry.fileUrl, '_blank');
        } else {
            alert('No file attached to this document');
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Identity': '#3b82f6',
            'Finance': '#22c55e',
            'Health': '#ef4444',
            'Career': '#a855f7',
            'Asset': '#eab308',
            'Legal': '#f97316',
            'Education': '#06b6d4',
            'Other': '#94a3b8'
        };
        return colors[category] || '#94a3b8';
    };

    // Filter documents based on active category
    const filteredEntries = activeCategory === 'All Documents'
        ? entries
        : entries.filter(entry => entry.category === activeCategory);

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#334155', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="documents" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #1e293b, #64748b)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <Briefcase size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>My Important Documents</h1>
                    </div>

                    <button
                        onClick={() => navigate('/documents/new')}
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
                        <Plus size={18} /> New Document
                    </button>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Secure storage for essential files.</p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px', flexWrap: 'wrap' }}>
                {['All Documents', 'Identity', 'Finance', 'Health', 'Career', 'Asset'].map((tab) => (
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                {isLoading ? (
                    <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '100px' }}>
                        <Loader2 className="animate-spin" size={48} color="#666" />
                    </div>
                ) : (
                    filteredEntries.map((item, idx) => (
                        <motion.div
                            key={item.id || idx}
                            whileHover={{ y: -4, borderColor: '#555' }}
                            style={{
                                backgroundColor: '#202020',
                                borderRadius: '12px',
                                padding: '24px',
                                border: '1px solid #333',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                position: 'relative'
                            }}
                        >
                            {/* Edit/Delete Actions */}
                            <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px', zIndex: 10 }}>
                                {item.fileUrl && (
                                    <button
                                        onClick={(e) => handleView(e, item)}
                                        style={{ background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#38bdf8', backdropFilter: 'blur(4px)' }}
                                        title="View"
                                    >
                                        <Eye size={12} />
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

                            <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                                <File size={28} color="#94a3b8" />
                            </div>

                            <h3 style={{ fontSize: '15px', fontWeight: 500, fontFamily: "'Inter', sans-serif", color: '#e5e5e5', marginBottom: '8px', wordBreak: 'break-word', paddingTop: '10px' }}>{item.title}</h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{
                                    fontSize: '11px',
                                    color: getCategoryColor(item.category),
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 500
                                }}>
                                    {item.category}
                                </span>
                            </div>

                            <span style={{ fontSize: '12px', color: '#666' }}>{item.fileSize}</span>
                        </motion.div>
                    ))
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>

            {filteredEntries.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                    <p style={{ fontSize: '18px' }}>No documents found in this category.</p>
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>Try selecting a different category or add a new document.</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ImportantDocuments;
