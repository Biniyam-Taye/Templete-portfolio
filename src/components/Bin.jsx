import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RotateCcw, X, AlertCircle } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import HeroImageUploader from './HeroImageUploader';

const Bin = () => {
    const [heroImage, setHeroImage] = useState(null);
    const [deletedItems, setDeletedItems] = useState([]);

    useEffect(() => {
        // Load deleted items from localStorage
        const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
        setDeletedItems(binItems);

        const heroImages = JSON.parse(localStorage.getItem('hero_images') || '{}');
        if (heroImages.bin) {
            setHeroImage(heroImages.bin);
        }
    }, []);

    const handleRestore = (item) => {
        // Restore item to its original collection
        const sourceKey = `${item.source}_entries`;
        const existingEntries = JSON.parse(localStorage.getItem(sourceKey) || '[]');
        existingEntries.unshift(item.data);
        localStorage.setItem(sourceKey, JSON.stringify(existingEntries));

        // Remove from bin
        const updatedBin = deletedItems.filter(binItem => binItem.id !== item.id);
        setDeletedItems(updatedBin);
        localStorage.setItem('bin_items', JSON.stringify(updatedBin));
    };

    const handlePermanentDelete = (item) => {
        if (window.confirm('Are you sure you want to permanently delete this item? This cannot be undone.')) {
            const updatedBin = deletedItems.filter(binItem => binItem.id !== item.id);
            setDeletedItems(updatedBin);
            localStorage.setItem('bin_items', JSON.stringify(updatedBin));
        }
    };

    const handleEmptyBin = () => {
        if (window.confirm('Are you sure you want to empty the entire bin? All items will be permanently deleted.')) {
            setDeletedItems([]);
            localStorage.setItem('bin_items', JSON.stringify([]));
        }
    };

    const getSourceLabel = (source) => {
        const labels = {
            'diary': 'Diary',
            'recipes': 'Recipe Book',
            'movies': 'Movie Database',
            'courses': 'Course List',
            'documents': 'Important Documents',
            'travel': 'Travel Planner',
            'strategy': 'Strategic Thinking',
            'experimental': 'Experimental Me',
            'library': 'Library'
        };
        return labels[source] || source;
    };

    const getSourceColor = (source) => {
        const colors = {
            'diary': '#f59e0b',
            'recipes': '#22c55e',
            'movies': '#ef4444',
            'courses': '#3b82f6',
            'documents': '#64748b',
            'travel': '#14b8a6',
            'strategy': '#6366f1',
            'experimental': '#818cf8',
            'library': '#a855f7'
        };
        return colors[source] || '#94a3b8';
    };

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#64748b', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden', backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <HeroImageUploader pageKey="bin" currentImage={heroImage} onImageChange={setHeroImage} />
                <div style={{ width: '100%', height: '100%', background: heroImage ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to bottom right, #475569, #94a3b8)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <Trash2 size={42} color="#fff" />
                        <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Bin</h1>
                    </div>

                    {deletedItems.length > 0 && (
                        <button
                            onClick={handleEmptyBin}
                            style={{
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
                            }}
                        >
                            <Trash2 size={18} /> Empty Bin
                        </button>
                    )}
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>
                    Deleted items are stored here. Restore them or delete permanently.
                </p>
            </div>

            {deletedItems.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '16px',
                    border: '1px solid #333'
                }}>
                    <Trash2 size={64} color="#444" style={{ marginBottom: '20px' }} />
                    <p style={{ fontSize: '20px', color: '#666', marginBottom: '10px' }}>Bin is empty</p>
                    <p style={{ fontSize: '14px', color: '#555' }}>Deleted items will appear here</p>
                </div>
            ) : (
                <>
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        padding: '16px 20px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <AlertCircle size={20} color="#eab308" />
                        <span style={{ color: '#a3a3a3', fontSize: '14px' }}>
                            Items in the bin can be restored or permanently deleted. {deletedItems.length} item{deletedItems.length !== 1 ? 's' : ''} in bin.
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {deletedItems.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    backgroundColor: '#202020',
                                    borderRadius: '12px',
                                    padding: '20px 24px',
                                    border: '1px solid #333',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            fontFamily: "'Inter', sans-serif",
                                            color: '#fff',
                                            margin: 0
                                        }}>
                                            {item.data.title || 'Untitled'}
                                        </h3>
                                        <span style={{
                                            fontSize: '12px',
                                            background: `${getSourceColor(item.source)}20`,
                                            color: getSourceColor(item.source),
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            fontWeight: 500
                                        }}>
                                            {getSourceLabel(item.source)}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                                        Deleted on {new Date(item.deletedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleRestore(item)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: '#22c55e',
                                            color: '#000',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <RotateCcw size={14} /> Restore
                                    </button>
                                    <button
                                        onClick={() => handlePermanentDelete(item)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: 'rgba(239,68,68,0.1)',
                                            color: '#ef4444',
                                            border: '1px solid #ef4444',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={14} /> Delete Forever
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default Bin;
