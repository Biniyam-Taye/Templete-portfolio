import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Calendar, Tag, Smile, Image, Upload } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const DiaryNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [coverImage, setCoverImage] = useState(null);
    const [editId, setEditId] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setContent(Array.isArray(entry.content) ? entry.content.join('\n') : entry.content);
            setTags(Array.isArray(entry.tags) ? entry.tags.join(', ') : entry.tags);
            setDate(entry.date || new Date().toISOString().split('T')[0]);
            setCoverImage(entry.coverImage || null);
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

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        const newEntry = {
            id: editId || Date.now(),
            title,
            content: content.split('\n').filter(line => line.trim() !== ''),
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            date,
            weekday: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
            day: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            coverImage
        };

        const existingEntries = JSON.parse(localStorage.getItem('diary_entries') || '[]');

        if (editId) {
            // Edit mode: Update existing entry
            const updatedEntries = existingEntries.map(ent => ent.id === editId ? newEntry : ent);
            localStorage.setItem('diary_entries', JSON.stringify(updatedEntries));
        } else {
            // Create mode: Add new entry to the beginning
            const updatedEntries = [newEntry, ...existingEntries];
            localStorage.setItem('diary_entries', JSON.stringify(updatedEntries));
        }

        navigate('/diary');
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    accept="image/*"
                />

                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', zIndex: 10, position: 'relative' }}>
                    <button
                        onClick={() => navigate('/diary')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#ccc',
                            cursor: 'pointer', fontSize: '14px', padding: '6px 12px', borderRadius: '6px',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <ArrowLeft size={16} /> Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#fff', color: 'black', border: 'none',
                            padding: '8px 24px', borderRadius: '6px', fontSize: '14px',
                            fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        <Save size={16} /> Save Entry
                    </button>
                </div>

                {/* Cover Image Area */}
                <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#202020',
                        borderRadius: '12px',
                        marginBottom: '40px',
                        border: '1px dashed #444',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.2s',
                        backgroundImage: coverImage ? `url(${coverImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                    onMouseEnter={(e) => { if (!coverImage) e.currentTarget.style.backgroundColor = '#2a2a2a' }}
                    onMouseLeave={(e) => { if (!coverImage) e.currentTarget.style.backgroundColor = '#202020' }}
                >
                    {!coverImage && (
                        <>
                            <Image size={32} color="#666" style={{ marginBottom: '10px' }} />
                            <span style={{ color: '#888', fontSize: '14px', fontWeight: 500 }}>Add Cover Image</span>
                        </>
                    )}
                    {coverImage && (
                        <div style={{
                            position: 'absolute', bottom: '10px', right: '10px',
                            background: 'rgba(0,0,0,0.6)', padding: '6px 12px',
                            borderRadius: '6px', color: 'white', fontSize: '12px',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <Upload size={12} /> Change Cover
                        </div>
                    )}
                </div>

                {/* Title Input */}
                <div style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Untitled"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            fontSize: '42px', fontWeight: 700, color: '#fff',
                            outline: 'none', placeholderColor: '#444'
                        }}
                    />
                </div>

                {/* Metadata Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #333' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Calendar size={16} /> Date
                        </div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#e0e0e0',
                                fontSize: '14px',
                                outline: 'none',
                                fontFamily: 'inherit',
                                colorScheme: 'dark', // Ensures picker is dark mode
                                cursor: 'pointer'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Tag size={16} /> Tags
                        </div>
                        <input
                            type="text"
                            placeholder="Empty"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            style={{
                                background: 'transparent', border: 'none',
                                color: '#e0e0e0', fontSize: '14px', outline: 'none',
                                flex: 1
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Smile size={16} /> Mood
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['😊', '😐', '😔', '😤', '😴'].map(emoji => (
                                <span key={emoji} style={{ cursor: 'pointer', opacity: 0.6, fontSize: '18px' }} onClick={(e) => { e.target.style.opacity = 1 }}>{emoji}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Editor Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ borderColor: '#555', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                    whileFocusWithin={{ borderColor: '#777', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', y: -2 }}
                    style={{
                        minHeight: '400px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '1px solid #333',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <textarea
                        placeholder="Press Enter to continue with an empty page, or start writing..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{
                            width: '100%', height: '500px', background: 'transparent',
                            border: 'none', color: '#e5e5e5', fontSize: '17px',
                            lineHeight: '1.8', outline: 'none', resize: 'none',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                        }}
                    />
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default DiaryNewEntry;
