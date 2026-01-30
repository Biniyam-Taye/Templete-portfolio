import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize2, X, Share2, Info, Heart, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Data for Design Portfolio
const designCollection = [
    {
        id: 1,
        title: "Zenith Banking App",
        description: "A complete overhaul of the mobile banking experience, focusing on financial wellness and intuitive navigation for Gen Z users.",
        medium: "UI/UX Design",
        year: "2024",
        dimensions: "Figma / iOS",
        src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
        aspect: "portrait",
        likes: 342,
        comments: [
            { user: "UXLead", text: "The dashboard layout is incredibly clean." },
            { user: "DevMike", text: "Love the dark mode palette." }
        ]
    },
    {
        id: 2,
        title: "EcoHome Brand Identity",
        description: "Branding package for a sustainable housing startup, including logo design, typography system, and marketing assets.",
        medium: "Branding",
        year: "2023",
        dimensions: "Vector / Print",
        src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000",
        aspect: "landscape",
        likes: 189,
        comments: []
    },
    {
        id: 3,
        title: "Nebula Dashboard",
        description: "SaaS analytics platform dashboard designed for high-data density visualization without cognitive overload.",
        medium: "Product Design",
        year: "2024",
        dimensions: "Web / 1920px",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
        aspect: "landscape",
        likes: 521,
        comments: [{ user: "DataViz", text: "Those charts are sexy." }]
    },
    {
        id: 4,
        title: "Lumina Smart Watch",
        description: "Interface design for a next-gen smartwatch interface, prioritizing glanceability and touch targets.",
        medium: "Interface Design",
        year: "2023",
        dimensions: "WearOS",
        src: "https://images.unsplash.com/photo-1517502474097-f9b30659dadb?q=80&w=1000",
        aspect: "square",
        likes: 134,
        comments: []
    },
    {
        id: 5,
        title: "Vogue Editorial Web",
        description: "Concept web redesign for a fashion magazine, merging high-impact typography with immersive imagery.",
        medium: "Web Design",
        year: "2022",
        dimensions: "Web / Responsive",
        src: "https://images.unsplash.com/photo-1509319117193-42d42741859d?q=80&w=1000",
        aspect: "portrait",
        likes: 276,
        comments: [{ user: "Fashionista", text: "So chic!" }]
    },
    {
        id: 6,
        title: "Aerospace Control",
        description: "HMI (Human Machine Interface) design for a drone control station.",
        medium: "Industrial Design / UI",
        year: "2023",
        dimensions: "Touchscreen",
        src: "https://images.unsplash.com/photo-1559028013-8f54b5095f7d?q=80&w=1000",
        aspect: "landscape",
        likes: 99,
        comments: []
    }
];

const DesignGalleryPage = () => {
    const navigate = useNavigate();
    const [galleryItems, setGalleryItems] = useState(designCollection);
    const [selectedItem, setSelectedItem] = useState(null);
    const [commentInput, setCommentInput] = useState("");

    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedItem]);

    const handleLike = (e, id) => {
        e.stopPropagation();
        setGalleryItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, likes: item.likes + 1, isLiked: true };
            }
            return item;
        }));
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!commentInput.trim() || !selectedItem) return;
        const newComment = { user: "You", text: commentInput };
        const updatedItem = { ...selectedItem, comments: [...selectedItem.comments, newComment] };
        setSelectedItem(updatedItem);
        setGalleryItems(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item));
        setCommentInput("");
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#f0f0f0', fontFamily: "'Inter', sans-serif" }}>

            {/* Navigation */}
            <nav style={{
                padding: '30px 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'fixed',
                top: 0, left: 0, width: '100%',
                zIndex: 50,
                background: 'linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0) 100%)',
                backdropFilter: 'blur(2px)'
            }}>
                <motion.button
                    onClick={() => navigate('/')}
                    whileHover={{ x: -4, color: '#d946ef' }}
                    style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                    <ArrowLeft size={20} /> Back to Hub
                </motion.button>
                <div style={{ fontFamily: "'Abril Fatface', serif", fontSize: '1.2rem', letterSpacing: '1px', opacity: 0.8 }}>
                    B.J. DESIGN
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{ padding: '160px 5% 120px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(70, 100, 239, 0.12) 0%, rgba(0,0,0,0) 60%)', pointerEvents: 'none', zIndex: 0, filter: 'blur(40px)' }} />

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontFamily: "'Abril Fatface', serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '30px', lineHeight: 1.1, position: 'relative', zIndex: 1, color: 'white', letterSpacing: '-1px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                >
                    <span style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                        Function, engineered
                    </span>
                </motion.h1>

                <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ duration: 0.8, delay: 0.4 }} style={{ width: '60px', height: '2px', background: '#3b82f6', margin: '0 auto 30px', position: 'relative', zIndex: 1 }} />

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '550px', margin: '0 auto', fontSize: '1.2rem', lineHeight: 1.7, position: 'relative', zIndex: 1, fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: '0.5px' }}>
                    <span style={{ fontStyle: 'italic', color: 'white' }}>"Design is intelligence made visible."</span> <br />
                    Solving complex problems with elegant, user-centric interfaces.
                </motion.p>
            </header>

            {/* Grid */}
            <main style={{ padding: '0 5% 100px', columnCount: 3, columnGap: '20px', maxWidth: '1800px', margin: '0 auto' }}>
                <style>{`
            @media (max-width: 1024px) { main { column-count: 2 !important; } }
            @media (max-width: 600px) { main { column-count: 1 !important; } }
          `}</style>
                {galleryItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        layoutId={`design-piece-${item.id}`}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        onClick={() => setSelectedItem(item)}
                        style={{ marginBottom: '40px', breakInside: 'avoid', position: 'relative', cursor: 'zoom-in' }}
                    >
                        <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
                            <motion.img src={item.src} alt={item.title} whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }} style={{ width: '100%', display: 'block' }} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <h3 style={{ fontFamily: "'Abril Fatface', serif", fontSize: '1.4rem', margin: 0, color: 'white' }}>{item.title}</h3>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <button onClick={(e) => handleLike(e, item.id)} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', color: item.isLiked ? '#ef4444' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                                        <Heart size={18} fill={item.isLiked ? "#ef4444" : "none"} /> {item.likes}
                                    </button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}><MessageCircle size={18} /> {item.comments.length}</div>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </main>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedItem(null)}>
                        <div style={{ position: 'absolute', top: '30px', right: '30px', display: 'flex', gap: '20px', zIndex: 101, pointerEvents: 'auto' }}>
                            <button onClick={(e) => { e.stopPropagation(); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}><Share2 size={24} /></button>
                            <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={32} /></button>
                        </div>
                        <motion.div layoutId={`design-piece-${selectedItem.id}`} style={{ display: 'flex', background: '#111', maxWidth: '1200px', width: '95vw', height: '85vh', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={(e) => e.stopPropagation()}>
                            <style>{`@media (max-width: 900px) { .lightbox-content { flex-direction: column; overflow-y: auto !important; } .lightbox-image { height: 50% !important; width: 100% !important; } .lightbox-details { width: 100% !important; padding: 20px !important; } }`}</style>
                            <div className="lightbox-image" style={{ width: '65%', height: '100%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={selectedItem.src} alt={selectedItem.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div className="lightbox-details" style={{ width: '35%', display: 'flex', flexDirection: 'column', padding: '40px', background: '#111', borderLeft: '1px solid #222' }}>
                                <div style={{ marginBottom: '30px' }}>
                                    <h2 style={{ fontFamily: "'Abril Fatface', serif", fontSize: '2.5rem', margin: '0 0 10px 0', lineHeight: 1.1 }}>{selectedItem.title}</h2>
                                    <p style={{ fontSize: '0.9rem', color: '#888', margin: 0 }}>{selectedItem.year} — {selectedItem.medium}</p>
                                </div>
                                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                                    <p style={{ color: '#ccc', lineHeight: 1.6, marginTop: 0 }}>{selectedItem.description}</p>
                                    <div style={{ margin: '30px 0', borderTop: '1px solid #222', paddingTop: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <button onClick={(e) => handleLike(e, selectedItem.id)} style={{ background: 'none', border: '1px solid #333', borderRadius: '4px', padding: '8px 16px', color: selectedItem.isLiked ? '#ef4444' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Heart size={18} fill={selectedItem.isLiked ? "#ef4444" : "none"} /> Like ({selectedItem.likes})
                                            </button>
                                            <span style={{ color: '#666', fontSize: '0.9rem' }}>{selectedItem.comments.length} comments</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#666', textTransform: 'uppercase' }}>Recent Comments</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {selectedItem.comments.length > 0 ? (selectedItem.comments.map((c, i) => (<div key={i} style={{ fontSize: '0.9rem' }}><span style={{ fontWeight: 'bold', color: '#d946ef' }}>{c.user}</span><p style={{ margin: '2px 0 0 0', color: '#aaa' }}>{c.text}</p></div>))) : (<p style={{ color: '#444', fontStyle: 'italic' }}>No comments yet.</p>)}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '20px' }}>
                                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
                                        <input type="text" placeholder="Write a comment..." value={commentInput} onChange={(e) => setCommentInput(e.target.value)} style={{ flex: 1, background: '#222', border: 'none', borderRadius: '4px', padding: '12px', color: 'white', fontFamily: "'Inter', sans-serif" }} />
                                        <button type="submit" style={{ background: '#3b82f6', border: 'none', borderRadius: '4px', padding: '0 15px', color: 'white', cursor: 'pointer' }}><Send size={18} /></button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DesignGalleryPage;
