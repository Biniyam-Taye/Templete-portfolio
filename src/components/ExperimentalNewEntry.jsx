import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Tag, Activity, FileText, GripVertical, Trash2, Type, List, CheckSquare, ChevronRight } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const ExperimentalNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Form State
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('Planned');
    const [tags, setTags] = useState('');
    const [editId, setEditId] = useState(null);

    // Block State for Rich Content
    const [blocks, setBlocks] = useState([{ id: Date.now().toString(), type: 'paragraph', content: '' }]);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setStatus(entry.status || 'Planned');
            setTags(Array.isArray(entry.tags) ? entry.tags.join(', ') : (entry.tags || ''));

            // Handle legacy notes (string) vs new notes (block array)
            if (Array.isArray(entry.notes)) {
                setBlocks(entry.notes);
            } else if (typeof entry.notes === 'string' && entry.notes.trim() !== '') {
                setBlocks([{ id: Date.now().toString(), type: 'paragraph', content: entry.notes }]);
            } else {
                setBlocks([{ id: Date.now().toString(), type: 'paragraph', content: '' }]);
            }
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
            notes: blocks // Save as block array
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

    // Block handlers
    const addBlock = (type) => {
        setBlocks([...blocks, { id: Date.now().toString(), type, content: '', checked: false, title: '' }]);
    };

    const removeBlock = (id) => {
        if (blocks.length > 1) {
            setBlocks(blocks.filter(b => b.id !== id));
        }
    };

    const updateBlock = (id, field, value) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const statusColors = {
        'Planned': '#94a3b8',
        'In Progress': '#eab308',
        'Completed': '#22c55e',
        'Failed': '#ef4444'
    };

    const inputStyle = {
        width: '100%',
        background: 'transparent',
        border: 'none',
        color: '#e5e5e5',
        fontSize: '16px',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'none',
        padding: '0'
    };

    const toolbarBtnStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        color: '#ccc',
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        transition: 'all 0.2s',
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #333', opacity: 0.8 }}>

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

                {/* Content Editor Area - Block Based */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '1px solid #333',
                        minHeight: '500px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #2a2a2a' }}>
                        <div style={{ display: 'flex', gap: '8px', color: '#666', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <FileText size={14} /> Content Blocks
                        </div>

                        {/* Editor Toolbar */}
                        <div style={{ display: 'flex', gap: '6px', background: '#252525', padding: '6px', borderRadius: '8px', border: '1px solid #333' }}>
                            <button onClick={() => addBlock('paragraph')} title="Text" style={toolbarBtnStyle}><Type size={16} /></button>
                            <button onClick={() => addBlock('bullet')} title="List" style={toolbarBtnStyle}><List size={16} /></button>
                            <button onClick={() => addBlock('todo')} title="To-do" style={toolbarBtnStyle}><CheckSquare size={16} /></button>
                            <button onClick={() => addBlock('toggle')} title="Toggle" style={toolbarBtnStyle}><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {blocks.map((block, index) => (
                            <div
                                key={block.id}
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'start',
                                    padding: '8px 0',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    const actions = e.currentTarget.querySelector('.block-actions');
                                    if (actions) actions.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    const actions = e.currentTarget.querySelector('.block-actions');
                                    if (actions) actions.style.opacity = '0';
                                }}
                            >
                                {/* Left Actions (Handle + Delete) */}
                                <div
                                    className="block-actions"
                                    style={{
                                        display: 'flex', gap: '4px', alignItems: 'center', marginTop: '6px',
                                        opacity: 0, transition: 'opacity 0.2s', width: '40px', justifyContent: 'flex-end',
                                        position: 'absolute', left: '-45px'
                                    }}
                                >
                                    <div style={{ cursor: 'grab', color: '#444' }}><GripVertical size={14} /></div>
                                    <button
                                        onClick={() => removeBlock(block.id)}
                                        style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                                        title="Delete block"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {/* Block Content */}
                                <div style={{ flex: 1, position: 'relative' }}>
                                    {block.type === 'paragraph' && (
                                        <textarea
                                            placeholder="Type something..."
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                            style={{ ...inputStyle, minHeight: '24px' }}
                                            rows={1}
                                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                        />
                                    )}

                                    {block.type === 'bullet' && (
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                            <div style={{ marginTop: '9px', minWidth: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></div>
                                            <textarea
                                                placeholder="List item"
                                                value={block.content}
                                                onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                style={{ ...inputStyle, minHeight: '24px' }}
                                                rows={1}
                                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                            />
                                        </div>
                                    )}

                                    {block.type === 'todo' && (
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                            <div
                                                onClick={() => updateBlock(block.id, 'checked', !block.checked)}
                                                style={{
                                                    marginTop: '4px',
                                                    width: '18px', height: '18px',
                                                    borderRadius: '4px',
                                                    border: `2px solid ${block.checked ? '#555' : '#444'}`,
                                                    background: block.checked ? '#555' : 'transparent',
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {block.checked && <CheckSquare size={12} color="white" />}
                                            </div>
                                            <textarea
                                                placeholder="To-do"
                                                value={block.content}
                                                onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                style={{
                                                    ...inputStyle, minHeight: '24px',
                                                    textDecoration: block.checked ? 'line-through' : 'none',
                                                    color: block.checked ? '#666' : '#e5e5e5',
                                                    transition: 'all 0.2s'
                                                }}
                                                rows={1}
                                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                            />
                                        </div>
                                    )}

                                    {block.type === 'toggle' && (
                                        <div style={{ paddingLeft: '4px' }}>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                                                <div
                                                    style={{ cursor: 'pointer', transform: 'rotate(0deg)', transition: 'transform 0.2s' }}
                                                    onClick={(e) => {
                                                        const contentDiv = e.currentTarget.parentNode.nextSibling;
                                                        const icon = e.currentTarget;
                                                        if (contentDiv.style.display === 'none') {
                                                            contentDiv.style.display = 'block';
                                                            icon.style.transform = 'rotate(90deg)';
                                                        } else {
                                                            contentDiv.style.display = 'none';
                                                            icon.style.transform = 'rotate(0deg)';
                                                        }
                                                    }}
                                                >
                                                    <ChevronRight size={18} color="#888" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Toggle Title"
                                                    value={block.title || ''}
                                                    onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                                                    style={{ ...inputStyle, fontWeight: 600, fontSize: '16px', color: '#fff' }}
                                                />
                                            </div>
                                            <div style={{ paddingLeft: '26px', display: 'none' }}>
                                                <textarea
                                                    placeholder="Content inside toggle..."
                                                    value={block.content}
                                                    onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                                                    style={{ ...inputStyle, fontSize: '15px', color: '#a3a3a3', minHeight: '60px' }}
                                                    onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div
                            onClick={() => addBlock('paragraph')}
                            style={{
                                marginTop: '10px', padding: '10px',
                                color: '#444', fontSize: '14px', cursor: 'text',
                                fontStyle: 'italic', opacity: 0.6
                            }}
                        >
                            Click + buttons above to add content...
                        </div>
                    </div>
                </motion.div>

            </div>
        </DashboardLayout>
    );
};

export default ExperimentalNewEntry;
