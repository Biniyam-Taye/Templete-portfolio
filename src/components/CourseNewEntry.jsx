import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Globe, BookOpen, Award, Link as LinkIcon, Calendar } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const CourseNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Form State
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('');
    const [instructor, setInstructor] = useState('');
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('In Progress');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [editId, setEditId] = useState(null);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setPlatform(entry.platform || '');
            setInstructor(entry.instructor || '');
            setProgress(entry.progress || 0);
            setStatus(entry.status || 'In Progress');
            setStartDate(entry.startDate || new Date().toISOString().split('T')[0]);
            setUrl(entry.url || '');
            setNotes(entry.notes || '');
        }
    }, [location.state]);

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a course title');
            return;
        }

        const newEntry = {
            id: editId || Date.now(),
            title,
            platform,
            instructor,
            progress: parseInt(progress) || 0,
            status,
            startDate,
            url,
            notes
        };

        const existingEntries = JSON.parse(localStorage.getItem('course_entries') || '[]');

        if (editId) {
            const updatedEntries = existingEntries.map(ent => ent.id === editId ? newEntry : ent);
            localStorage.setItem('course_entries', JSON.stringify(updatedEntries));
        } else {
            const updatedEntries = [newEntry, ...existingEntries];
            localStorage.setItem('course_entries', JSON.stringify(updatedEntries));
        }

        navigate('/courses');
    };

    const statusColors = {
        'Not Started': '#94a3b8',
        'In Progress': '#3b82f6',
        'Completed': '#22c55e',
        'On Hold': '#eab308'
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate('/courses')}
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
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#fff', color: 'black', border: 'none',
                            padding: '8px 24px', borderRadius: '6px', fontSize: '14px',
                            fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        <Save size={16} /> {editId ? 'Update Course' : 'Save Course'}
                    </button>
                </div>

                {/* Title */}
                <div style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Course Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            fontSize: '42px', fontWeight: 700, color: '#fff',
                            outline: 'none', marginBottom: '10px', fontFamily: "'Inter', sans-serif"
                        }}
                    />
                </div>

                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #333' }}>
                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Award size={16} /> Status
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {['Not Started', 'In Progress', 'Completed', 'On Hold'].map(s => (
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

                    {/* Progress Slider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <BookOpen size={16} /> Progress
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={(e) => setProgress(e.target.value)}
                                style={{
                                    flex: 1,
                                    accentColor: '#38bdf8',
                                    height: '6px',
                                    borderRadius: '3px'
                                }}
                            />
                            <span style={{ color: '#fff', fontSize: '16px', fontWeight: 600, minWidth: '50px', textAlign: 'right' }}>{progress}%</span>
                        </div>
                    </div>

                    {/* Platform & Instructor */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Globe size={18} color="#666" />
                            <input
                                type="text" placeholder="Platform (e.g. Udemy)" value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Award size={18} color="#666" />
                            <input
                                type="text" placeholder="Instructor" value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Start Date & URL */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={18} color="#666" />
                            <input
                                type="date" value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%', colorScheme: 'dark' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <LinkIcon size={18} color="#666" />
                            <input
                                type="url" placeholder="Course URL" value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
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
                    <div style={{ marginBottom: '20px', color: '#666', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Notes & Key Learnings
                    </div>
                    <textarea
                        placeholder="What are you learning? Key takeaways, important concepts, etc."
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

export default CourseNewEntry;
