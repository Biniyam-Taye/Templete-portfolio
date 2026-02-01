import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from './DashboardLayout';
import { movieApi } from '../utils/api';
import { ArrowLeft, Save, Star, Film, Calendar, Tv, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';

const MovieNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    // Form State
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('Watched');
    const [rating, setRating] = useState(0); // 0 to 5
    const [genre, setGenre] = useState('');
    const [platform, setPlatform] = useState('');
    const [watchDate, setWatchDate] = useState(new Date().toISOString().split('T')[0]);
    const [review, setReview] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [editId, setEditId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setStatus(entry.status || 'Watched');
            setRating(parseFloat(entry.rating) || 0);
            setGenre(entry.genre || '');
            setPlatform(entry.platform || '');
            setWatchDate(entry.watchDate || entry.watched || new Date().toISOString().split('T')[0]);
            setReview(entry.review || '');
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

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Please enter a movie title');
            return;
        }

        setIsSaving(true);
        try {
            const entryData = {
                title,
                status,
                rating,
                genre,
                platform,
                watched: watchDate,
                review,
                coverImage
            };

            if (editId) {
                await movieApi.update(editId, entryData);
            } else {
                await movieApi.create(entryData);
            }
            navigate('/movies');
        } catch (err) {
            console.error('Failed to save movie:', err);
            alert('Failed to save movie');
        } finally {
            setIsSaving(false);
        }
    };

    const statusColors = {
        'Watched': '#22c55e',
        'Watchlist': '#3b82f6',
        'Watching': '#eab308',
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
                        onClick={() => navigate('/movies')}
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
                        {isSaving ? 'Saving...' : editId ? 'Update Movie' : 'Save Movie'}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                    {/* Cover Image Upload */}
                    <div
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            width: '200px', height: '300px',
                            backgroundColor: '#202020', borderRadius: '12px',
                            border: '1px dashed #444', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', position: 'relative',
                            backgroundImage: coverImage ? `url(${coverImage})` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center',
                            flexShrink: 0
                        }}
                        onMouseEnter={(e) => { if (!coverImage) e.currentTarget.style.borderColor = '#666'; }}
                        onMouseLeave={(e) => { if (!coverImage) e.currentTarget.style.borderColor = '#444'; }}
                    >
                        {!coverImage && (
                            <>
                                <ImageIcon size={32} color="#666" style={{ marginBottom: '10px' }} />
                                <span style={{ color: '#888', fontSize: '13px' }}>Upload Poster</span>
                            </>
                        )}
                        {coverImage && (
                            <div style={{
                                position: 'absolute', bottom: '10px', right: '10px',
                                background: 'rgba(0,0,0,0.6)', padding: '4px 8px',
                                borderRadius: '4px', color: 'white', fontSize: '11px',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                <Upload size={10} /> Change
                            </div>
                        )}
                    </div>

                    {/* Movie Details Form */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Title */}
                        <div>
                            <input
                                type="text"
                                placeholder="Movie Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    width: '100%', background: 'transparent', border: 'none',
                                    fontSize: '36px', fontWeight: 700, color: '#fff',
                                    outline: 'none', placeholderColor: '#444', marginBottom: '10px'
                                }}
                            />
                        </div>

                        {/* Status & Rating */}
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {['Watched', 'Watchlist', 'Watching'].map(s => (
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

                            {/* Star Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={20}
                                        fill={star <= rating ? "#fbbf24" : "transparent"}
                                        color={star <= rating ? "#fbbf24" : "#555"}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Film size={18} color="#666" />
                                <input
                                    type="text" placeholder="Genre" value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Tv size={18} color="#666" />
                                <input
                                    type="text" placeholder="Platform (e.g. Netflix)" value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar size={18} color="#666" />
                                <input
                                    type="date" value={watchDate}
                                    onChange={(e) => setWatchDate(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%', colorScheme: 'dark' }}
                                />
                            </div>
                        </div>

                        {/* Review / Notes */}
                        <div style={{ marginTop: '20px' }}>
                            <textarea
                                placeholder="Write your review or notes here..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                style={{
                                    width: '100%', minHeight: '150px', background: '#1a1a1a',
                                    border: '1px solid #333', borderRadius: '12px', padding: '20px',
                                    color: '#e5e5e5', fontSize: '15px', lineHeight: '1.6', outline: 'none', resize: 'vertical'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MovieNewEntry;
