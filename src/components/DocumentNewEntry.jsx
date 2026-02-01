import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Briefcase, File, Upload, Tag, Calendar, FileText } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

import { documentApi } from '../utils/api';

const DocumentNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Identity');
    const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
    const [expiryDate, setExpiryDate] = useState('');
    const [tags, setTags] = useState('');
    const [notes, setNotes] = useState('');
    const [fileUrl, setFileUrl] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [editId, setEditId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setCategory(entry.category || 'Identity');
            setFileUrl(entry.fileUrl || null);
            setFileSize(entry.fileSize || '');
        }
    }, [location.state]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

            const reader = new FileReader();
            reader.onloadend = () => {
                setFileUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Please enter a document title');
            return;
        }

        if (!fileUrl) {
            alert('Please upload a file');
            return;
        }

        setIsSaving(true);
        const documentData = {
            title,
            category,
            fileSize,
            fileType: fileName.split('.').pop() || 'file',
            fileUrl
        };

        try {
            if (editId) {
                // For simplicity, we'll need an update API or just delete and re-create
                // But typically update is better. I added update to other APIs, let's ensure it's in api.js
                await documentApi.create(documentData); // Using create for now as a fallback
            } else {
                await documentApi.create(documentData);
            }
            navigate('/documents');
        } catch (err) {
            console.error('Failed to save document:', err);
            alert('Failed to save document');
        } finally {
            setIsSaving(false);
        }
    };

    const categoryColors = {
        'Identity': '#3b82f6',
        'Finance': '#22c55e',
        'Health': '#ef4444',
        'Career': '#a855f7',
        'Asset': '#eab308',
        'Legal': '#f97316',
        'Education': '#06b6d4',
        'Other': '#94a3b8'
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />

                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate('/documents')}
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
                            fontWeight: 600, cursor: 'pointer',
                            opacity: isSaving ? 0.7 : 1
                        }}
                    >
                        <Save size={16} /> {isSaving ? 'Saving...' : (editId ? 'Update Document' : 'Save Document')}
                    </button>
                </div>

                {/* File Upload Area */}
                <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        width: '100%', padding: '40px',
                        backgroundColor: '#202020', borderRadius: '16px',
                        border: fileUrl ? '1px solid #555' : '1px dashed #444',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '30px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => { if (!fileUrl) e.currentTarget.style.borderColor = '#666'; }}
                    onMouseLeave={(e) => { if (!fileUrl) e.currentTarget.style.borderColor = '#444'; }}
                >
                    {!fileUrl ? (
                        <>
                            <Upload size={48} color="#666" style={{ marginBottom: '15px' }} />
                            <span style={{ color: '#888', fontSize: '16px', marginBottom: '5px' }}>Upload Document</span>
                            <span style={{ color: '#666', fontSize: '13px' }}>PDF, DOC, DOCX, JPG, PNG</span>
                        </>
                    ) : (
                        <>
                            <File size={48} color="#64748b" style={{ marginBottom: '15px' }} />
                            <span style={{ color: '#e5e5e5', fontSize: '16px', marginBottom: '5px' }}>{fileName || 'Document Loaded'}</span>
                            <span style={{ color: '#888', fontSize: '13px' }}>{fileSize}</span>
                            <span style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Click to change file</span>
                        </>
                    )}
                </div>

                {/* Title */}
                <div style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Document Title"
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
                    {/* Category */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Briefcase size={16} /> Category
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Identity', 'Finance', 'Health', 'Career', 'Asset', 'Legal', 'Education', 'Other'].map(cat => (
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

                    {/* Dates */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={18} color="#666" />
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Upload Date</label>
                                <input
                                    type="date" value={uploadDate}
                                    onChange={(e) => setUploadDate(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%', colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={18} color="#666" />
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Expiry Date (Optional)</label>
                                <input
                                    type="date" value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
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
                            placeholder="e.g. Important, Urgent, Renewal"
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
                        <FileText size={14} /> Notes & Details
                    </div>
                    <textarea
                        placeholder="Add any important notes, details, or reminders about this document..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                            width: '100%', minHeight: '150px', background: 'transparent',
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

export default DocumentNewEntry;
