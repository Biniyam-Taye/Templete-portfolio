import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, LayoutGrid, Target, Zap, TrendingUp, Calendar, FileText } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const StrategyNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [impact, setImpact] = useState('Medium');
    const [effort, setEffort] = useState('Medium');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('Career');
    const [targetDate, setTargetDate] = useState('');
    const [status, setStatus] = useState('Planning');
    const [notes, setNotes] = useState('');
    const [editId, setEditId] = useState(null);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setDescription(entry.description || entry.desc || '');
            setImpact(entry.impact || 'Medium');
            setEffort(entry.effort || 'Medium');
            setPriority(entry.priority || 'Medium');
            setCategory(entry.category || 'Career');
            setTargetDate(entry.targetDate || '');
            setStatus(entry.status || 'Planning');
            setNotes(entry.notes || '');
        }
    }, [location.state]);

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a strategy title');
            return;
        }

        const newEntry = {
            id: editId || Date.now(),
            title,
            description,
            desc: description, // for backward compatibility
            impact,
            effort,
            priority,
            category,
            targetDate,
            status,
            notes
        };

        const existingEntries = JSON.parse(localStorage.getItem('strategy_entries') || '[]');

        if (editId) {
            const updatedEntries = existingEntries.map(ent => ent.id === editId ? newEntry : ent);
            localStorage.setItem('strategy_entries', JSON.stringify(updatedEntries));
        } else {
            const updatedEntries = [newEntry, ...existingEntries];
            localStorage.setItem('strategy_entries', JSON.stringify(updatedEntries));
        }

        navigate('/strategy');
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Low': return '#22c55e';
            case 'Medium': return '#eab308';
            case 'High': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    const categoryColors = {
        'Career': '#3b82f6',
        'Finance': '#22c55e',
        'Health': '#ef4444',
        'Personal': '#a855f7',
        'Business': '#f97316',
        'Learning': '#06b6d4',
        'Other': '#94a3b8'
    };

    const statusColors = {
        'Idea': '#94a3b8',
        'Planning': '#3b82f6',
        'In Progress': '#eab308',
        'Completed': '#22c55e',
        'On Hold': '#64748b'
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate('/strategy')}
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
                        <Save size={16} /> {editId ? 'Update Strategy' : 'Save Strategy'}
                    </button>
                </div>

                {/* Title */}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Strategy Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            fontSize: '42px', fontWeight: 700, color: '#fff',
                            outline: 'none', marginBottom: '10px', fontFamily: "'Inter', sans-serif"
                        }}
                    />
                    <textarea
                        placeholder="Brief description of this strategic goal..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            fontSize: '16px', color: '#a3a3a3',
                            outline: 'none', resize: 'none', minHeight: '60px',
                            fontFamily: "'Inter', sans-serif"
                        }}
                    />
                </div>

                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #333' }}>
                    {/* Impact */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Target size={16} /> Impact
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['Low', 'Medium', 'High'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setImpact(level)}
                                    style={{
                                        background: impact === level ? getLevelColor(level) : 'rgba(255,255,255,0.05)',
                                        color: impact === level ? '#000' : '#888',
                                        border: 'none', padding: '6px 16px', borderRadius: '20px',
                                        fontSize: '13px', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Effort */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Zap size={16} /> Effort
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['Low', 'Medium', 'High'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setEffort(level)}
                                    style={{
                                        background: effort === level ? getLevelColor(level) : 'rgba(255,255,255,0.05)',
                                        color: effort === level ? '#000' : '#888',
                                        border: 'none', padding: '6px 16px', borderRadius: '20px',
                                        fontSize: '13px', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <TrendingUp size={16} /> Priority
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['Low', 'Medium', 'High'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setPriority(level)}
                                    style={{
                                        background: priority === level ? getLevelColor(level) : 'rgba(255,255,255,0.05)',
                                        color: priority === level ? '#000' : '#888',
                                        border: 'none', padding: '6px 16px', borderRadius: '20px',
                                        fontSize: '13px', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <LayoutGrid size={16} /> Category
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Career', 'Finance', 'Health', 'Personal', 'Business', 'Learning', 'Other'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        background: category === cat ? categoryColors[cat] : 'rgba(255,255,255,0.05)',
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

                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <FileText size={16} /> Status
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Idea', 'Planning', 'In Progress', 'Completed', 'On Hold'].map(s => (
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

                    {/* Target Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Calendar size={16} /> Target Date
                        </div>
                        <input
                            type="date" value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', colorScheme: 'dark' }}
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
                        <FileText size={14} /> Action Plan & Notes
                    </div>
                    <textarea
                        placeholder="Outline your action plan, key milestones, resources needed, potential obstacles, and any other strategic notes..."
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

export default StrategyNewEntry;
