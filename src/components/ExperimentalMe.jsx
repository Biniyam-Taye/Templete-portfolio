import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Filter, ArrowUpDown, Search, Trash2, Edit2, Loader2, X } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';
import { experimentApi, binApi, heroImageApi } from '../utils/api';

const ExperimentalMe = () => {
    const navigate = useNavigate();

    const [entries, setEntries] = useState([]);
    const [heroImage, setHeroImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    useEffect(() => {
        fetchHeroImage();
        fetchExperiments();
    }, []);

    const fetchHeroImage = async () => {
        try {
            const data = await heroImageApi.get('experimental');
            if (data.image) {
                setHeroImage(data.image);
            }
        } catch (err) {
            console.error('Failed to fetch hero image:', err);
        }
    };

    const fetchExperiments = async () => {
        setIsLoading(true);
        try {
            const data = await experimentApi.getAll();
            setEntries(data || []);
        } catch (err) {
            console.error('Failed to fetch experiments:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this experiment?')) {
            const itemToDelete = entries.find(entry => entry.id === id);
            try {
                await binApi.moveToBin('experimental', itemToDelete);
                await experimentApi.delete(id);
                setEntries(entries.filter(entry => entry.id !== id));
            } catch (err) {
                console.error('Failed to delete experiment:', err);
                alert('Failed to delete experiment');
            }
        }
    };

    const handleEdit = (e, entry) => {
        e.stopPropagation();
        navigate('/experimental-me/new', { state: { entry } });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#22c55e';
            case 'In Progress': return '#eab308';
            case 'Failed': return '#ef4444';
            default: return '#94a3b8'; // Planned
        }
    };

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (Array.isArray(entry.tags) && entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#4f46e5', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="experimental" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #4338ca, #818cf8)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Star size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Experimental Me</h1>
                    </div>

                    {/* Header Actions */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {isSearchVisible ? (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
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
                        
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer', paddingRight: '30px' }}
                            >
                                <option value="All">All Status</option>
                                <option value="Planned">Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Failed">Failed</option>
                            </select>
                            <Filter size={14} color="#888" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
                        </div>

                        <button
                            onClick={() => navigate('/experimental-me/new')}
                            style={{
                                backgroundColor: '#fff',
                                color: 'black',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginLeft: '12px'
                            }}
                        >
                            New Experiment
                        </button>
                    </div>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Tracking habits, challenges, and personal experiments.</p>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                    <Loader2 className="animate-spin" size={48} color="#666" />
                </div>
            ) : filteredEntries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 20px', color: '#666', background: '#1a1a1a', borderRadius: '16px', border: '1px solid #333' }}>
                    <Star size={48} color="#333" style={{ marginBottom: '15px' }} />
                    <p style={{ fontSize: '18px', margin: 0 }}>No experiments found</p>
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>{searchQuery ? 'Try a different search term' : 'Start a new experiment to track your journey'}</p>
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
                                position: 'relative',
                                minHeight: '180px'
                            }}
                        >
                            {/* Edit/Delete Actions */}
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px', zIndex: 10 }}>
                                <button
                                    onClick={(e) => handleEdit(e, item)}
                                    style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#999', backdropFilter: 'blur(4px)' }}
                                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                                    onMouseLeave={(e) => e.target.style.color = '#999'}
                                    title="Edit"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', color: '#999', backdropFilter: 'blur(4px)' }}
                                    onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                    onMouseLeave={(e) => e.target.style.color = '#999'}
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', marginBottom: '8px', paddingRight: '60px' }}>{item.title}</h3>
                            <span style={{ fontSize: '13px', color: getStatusColor(item.status), background: `${getStatusColor(item.status)}15`, padding: '2px 8px', borderRadius: '4px' }}>{item.status}</span>

                            {/* Notes Rendering */}
                            <div style={{ marginTop: '12px' }}>
                                {typeof item.notes === 'string' ? (
                                    <p style={{ color: '#a3a3a3', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{item.notes}</p>
                                ) : Array.isArray(item.notes) ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {item.notes.slice(0, 3).map((block, i) => {
                                            if (block.type === 'paragraph') return <p key={i} style={{ color: '#a3a3a3', fontSize: '14px', margin: 0, lineHeight: '1.5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.content}</p>;
                                            if (block.type === 'bullet') return (
                                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#a3a3a3', fontSize: '14px', overflow: 'hidden' }}>
                                                    <span style={{ minWidth: '4px', height: '4px', borderRadius: '50%', background: '#666' }}></span>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.content}</span>
                                                </div>
                                            );
                                            return null;
                                        })}
                                        {item.notes.length > 3 && <span style={{ fontSize: '12px', color: '#555' }}>+{item.notes.length - 3} more blocks</span>}
                                    </div>
                                ) : null}
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
export default ExperimentalMe;
