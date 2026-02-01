import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, BookOpen, User, Calendar, Star, Tag, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { libraryApi } from '../utils/api';

const LibraryNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    // Form State
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState('To Read');
    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState('Fiction');
    const [dateAdded, setDateAdded] = useState(new Date().toISOString().split('T')[0]);
    const [dateFinished, setDateFinished] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [notes, setNotes] = useState('');
    const [editId, setEditId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setAuthor(entry.author || '');
            setStatus(entry.status || 'To Read');
            setRating(entry.rating || 0);
            setCategory(entry.category || 'Fiction');
            setDateAdded(entry.dateAdded || new Date().toISOString().split('T')[0]);
            setDateFinished(entry.dateFinished || '');
            setTags(Array.isArray(entry.tags) ? entry.tags.join(', ') : (entry.tags || ''));
            setCoverImage(entry.coverImage || null);
            setNotes(entry.notes || '');
        }
    }, [location.state]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Please enter a book title');
            return;
        }

        setIsSaving(true);
        try {
            const entryData = {
                title,
                author,
                status,
                rating: parseInt(rating) || 0,
                category,
                dateAdded,
                dateFinished,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                coverImage,
                notes,
                type: category // Backend uses 'type' for categorization
            };

            if (editId) {
                await libraryApi.update(editId, entryData);
            } else {
                await libraryApi.create(entryData);
            }
            navigate('/library');
        } catch (err) {
            console.error('Failed to save book:', err);
            alert('Failed to save book');
        } finally {
            setIsSaving(false);
        }
    };

    const statusColors = {
        'To Read': '#eab308',
        'Reading': '#3b82f6',
        'Completed': '#22c55e',
        'On Hold': '#94a3b8',
        'Dropped': '#ef4444'
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    accept="image/*"
                />

                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate('/library')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#ccc',
                            cursor: 'pointer', fontSize: '14px', padding: '6px 12px', borderRadius: '6px',
                        }}
                    >
                        <ArrowLeft size={16} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#fff', color: 'black', border: 'none',
                            padding: '8px 24px', borderRadius: '6px', fontSize: '14px',
                            fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer',
                            opacity: isSaving ? 0.7 : 1
                        }}
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                        {isSaving ? 'Saving...' : editId ? 'Update Book' : 'Save Book'}
                    </button>
                </div>

                {/* Cover Image */}
                <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        width: '200px', height: '300px', margin: '0 auto 30px',
                        backgroundColor: '#202020', borderRadius: '12px',
                        border: '1px dashed #444', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        backgroundImage: coverImage ? `url(${coverImage})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }}
                >
                    {!coverImage && (
                        <>
                            <ImageIcon size={48} color="#666" style={{ marginBottom: '10px' }} />
                            <span style={{ color: '#888', fontSize: '14px' }}>Upload Cover</span>
                        </>
                    )}
                </div>

                {/* Title & Author */}
                <div style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Book Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            fontSize: '42px', fontWeight: 700, color: '#fff',
                            outline: 'none', marginBottom: '15px', fontFamily: "'Inter', sans-serif"
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} color="#666" />
                        <input
                            type="text"
                            placeholder="Author Name"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            style={{
                                flex: 1, background: 'transparent', border: 'none',
                                fontSize: '20px', color: '#a3a3a3',
                                outline: 'none', fontFamily: "'Inter', sans-serif"
                            }}
                        />
                    </div>
                </div>

                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #333' }}>
                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <BookOpen size={16} /> Status
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['To Read', 'Reading', 'Completed', 'On Hold', 'Dropped'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    style={{
                                        background: status === s ? statusColors[s] : 'rgba(255,255,255,0.05)',
                                        color: status === s ? '#000' : '#888',
                                        border: 'none', padding: '6px 12px', borderRadius: '20px',
                                        fontSize: '13px', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Star size={16} /> Rating
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={24}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: 'pointer' }}
                                    color={star <= rating ? '#fbbf24' : '#444'}
                                    fill={star <= rating ? '#fbbf24' : 'none'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Tag size={16} /> Category
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Fiction', 'Non-Fiction', 'Self-Help', 'Programming', 'Design', 'History', 'Science', 'Other'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        background: category === cat ? '#7c3aed' : 'rgba(255,255,255,0.05)',
                                        color: category === cat ? '#000' : '#888',
                                        border: 'none', padding: '6px 12px', borderRadius: '20px',
                                        fontSize: '13px', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={18} color="#666" />
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Date Added</label>
                                <input
                                    type="date" value={dateAdded}
                                    onChange={(e) => setDateAdded(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%', colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={18} color="#666" />
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Date Finished</label>
                                <input
                                    type="date" value={dateFinished}
                                    onChange={(e) => setDateFinished(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%', colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Tag size={16} /> Tags
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. Favorite, Must-Read, Recommended"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            style={{
                                background: 'transparent', border: 'none',
                                color: '#e0e0e0', fontSize: '14px', outline: 'none',
                                flex: 1
                            }}
                        />
                    </div>
                </div>

                {/* Notes Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '1px solid #333'
                    }}
                >
                    <div style={{ marginBottom: '20px', color: '#666', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={14} /> Notes & Thoughts
                    </div>
                    <textarea
                        placeholder="Key takeaways, favorite quotes, thoughts, or anything you want to remember about this book..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                            width: '100%', minHeight: '200px', background: 'transparent',
                            border: 'none', color: '#e5e5e5', fontSize: '15px',
                            lineHeight: '1.6', outline: 'none', resize: 'vertical',
                            fontFamily: "'Inter', sans-serif"
                        }}
                    />
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default LibraryNewEntry;
