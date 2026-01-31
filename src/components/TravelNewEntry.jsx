import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Map, MapPin, Calendar, Plane, DollarSign, Users, Image as ImageIcon, Upload, FileText } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const TravelNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    // Form State
    const [title, setTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [status, setStatus] = useState('Planning');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState('');
    const [travelers, setTravelers] = useState('');
    const [accommodation, setAccommodation] = useState('');
    const [transportation, setTransportation] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [notes, setNotes] = useState('');
    const [editId, setEditId] = useState(null);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setDestination(entry.destination || '');
            setStatus(entry.status || 'Planning');
            setStartDate(entry.startDate || '');
            setEndDate(entry.endDate || '');
            setBudget(entry.budget || '');
            setTravelers(entry.travelers || '');
            setAccommodation(entry.accommodation || '');
            setTransportation(entry.transportation || '');
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

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a trip title');
            return;
        }

        const newEntry = {
            id: editId || Date.now(),
            title,
            destination,
            status,
            startDate,
            endDate,
            budget,
            travelers,
            accommodation,
            transportation,
            coverImage,
            notes
        };

        const existingEntries = JSON.parse(localStorage.getItem('travel_entries') || '[]');

        if (editId) {
            const updatedEntries = existingEntries.map(ent => ent.id === editId ? newEntry : ent);
            localStorage.setItem('travel_entries', JSON.stringify(updatedEntries));
        } else {
            const updatedEntries = [newEntry, ...existingEntries];
            localStorage.setItem('travel_entries', JSON.stringify(updatedEntries));
        }

        navigate('/travel');
    };

    const statusColors = {
        'Idea': '#94a3b8',
        'Planning': '#3b82f6',
        'Booked': '#22c55e',
        'Completed': '#a855f7',
        'Cancelled': '#ef4444'
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
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
                        onClick={() => navigate('/travel')}
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
                        <Save size={16} /> {editId ? 'Update Trip' : 'Save Trip'}
                    </button>
                </div>

                {/* Cover Image */}
                <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        width: '100%', height: '300px',
                        backgroundColor: '#202020', borderRadius: '16px',
                        border: '1px dashed #444', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', position: 'relative',
                        backgroundImage: coverImage ? `url(${coverImage})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        marginBottom: '30px'
                    }}
                >
                    {!coverImage && (
                        <>
                            <ImageIcon size={48} color="#666" style={{ marginBottom: '10px' }} />
                            <span style={{ color: '#888', fontSize: '14px' }}>Upload Destination Photo</span>
                        </>
                    )}
                    {coverImage && (
                        <div style={{
                            position: 'absolute', bottom: '15px', right: '15px',
                            background: 'rgba(0,0,0,0.7)', padding: '8px 16px',
                            borderRadius: '6px', color: 'white', fontSize: '13px',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <Upload size={14} /> Change Photo
                        </div>
                    )}
                </div>

                {/* Title & Destination */}
                <div style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Trip Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            fontSize: '42px', fontWeight: 700, color: '#fff',
                            outline: 'none', marginBottom: '15px', fontFamily: "'Inter', sans-serif"
                        }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapPin size={20} color="#666" />
                        <input
                            type="text"
                            placeholder="Destination (e.g. Tokyo, Japan)"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            style={{
                                flex: 1, background: 'transparent', border: 'none',
                                fontSize: '20px', color: '#a3a3a3',
                                outline: 'none', fontFamily: "'Inter', sans-serif"
                            }}
                        />
                    </div>
                </div>

                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #333' }}>
                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Map size={16} /> Status
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {['Idea', 'Planning', 'Booked', 'Completed', 'Cancelled'].map(s => (
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

                    {/* Dates */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={18} color="#666" />
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Start Date</label>
                                <input
                                    type="date" value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%', colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={18} color="#666" />
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>End Date</label>
                                <input
                                    type="date" value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%', colorScheme: 'dark' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Budget & Travelers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <DollarSign size={18} color="#666" />
                            <input
                                type="text" placeholder="Budget (e.g. $2000)" value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Users size={18} color="#666" />
                            <input
                                type="text" placeholder="Travelers (e.g. 2 people)" value={travelers}
                                onChange={(e) => setTravelers(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Accommodation & Transportation */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={18} color="#666" />
                            <input
                                type="text" placeholder="Accommodation" value={accommodation}
                                onChange={(e) => setAccommodation(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Plane size={18} color="#666" />
                            <input
                                type="text" placeholder="Transportation" value={transportation}
                                onChange={(e) => setTransportation(e.target.value)}
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
                    <div style={{ marginBottom: '20px', color: '#666', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={14} /> Itinerary & Notes
                    </div>
                    <textarea
                        placeholder="Add your itinerary, must-visit places, booking details, or any other notes..."
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

export default TravelNewEntry;
