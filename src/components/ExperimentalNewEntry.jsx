import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Tag, Activity, FileText } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const ExperimentalNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Form State
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('Planned');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');
    const [editId, setEditId] = useState(null);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setStatus(entry.status || 'Planned');
            setTags(Array.isArray(entry.tags) ? entry.tags.join(', ') : (entry.tags || ''));
            setNotes(entry.notes || '');
        }
    }, [location.state]);

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        const newEntry = {
            id: editId || Date.now(),
            title,
            status,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            notes
        };

        const existingEntries = JSON.parse(localStorage.getItem('experimental_entries') || '[]');

        if (editId) {
            // Edit mode: Update existing
            const updatedEntries = existingEntries.map(ent => ent.id === editId ? newEntry : ent);
            localStorage.setItem('experimental_entries', JSON.stringify(updatedEntries));
        } else {
            // Create mode: Add new
            const updatedEntries = [newEntry, ...existingEntries];
            localStorage.setItem('experimental_entries', JSON.stringify(updatedEntries));
        }

        navigate('/experimental-me');
    };

    const statusColors = {
        'Planned': '#94a3b8',
        'In Progress': '#eab308',
        'Completed': '#22c55e',
        'Failed': '#ef4444'
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>

                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate('/experimental-me')}
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
                        <Save size={16} /> {editId ? 'Update Experiment' : 'Save Experiment'}
                    </button>
                </div>

                {/* Title Input */}
                <div style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Experiment Name"
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #333' }}>

                    {/* Status Picker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Activity size={16} /> Status
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['Planned', 'In Progress', 'Completed', 'Failed'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    style={{
                                        background: status === s ? statusColors[s] : 'rgba(255,255,255,0.05)',
                                        color: status === s ? '#000' : '#888',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags Input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Tag size={16} /> Tags
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. Health, Coding, Habit"
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

                {/* Notes Editor Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        minHeight: '300px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '16px',
                        padding: '30px',
                        border: '1px solid #333'
                    }}
                >
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                        <FileText size={16} /> Notes / Observations
                    </div>
                    <textarea
                        placeholder="Describe your experiment, hypothesis, or results..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                            width: '100%', height: '300px', background: 'transparent',
                            border: 'none', color: '#e5e5e5', fontSize: '16px',
                            lineHeight: '1.6', outline: 'none', resize: 'none',
                            fontFamily: 'inherit'
                        }}
                    />
                </motion.div>

            </div>
        </DashboardLayout>
    );
};

export default ExperimentalNewEntry;
