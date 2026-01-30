import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Plus, MoreHorizontal, Filter, ArrowUpDown, LayoutGrid,
    ChevronRight, ChevronDown, Book, FileText, Globe, Briefcase,
    Map, Trash2, Sidebar, Menu, Star, CheckSquare, Smile, PenTool
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DiaryPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('June');

    const sidebarItems = [
        { icon: Book, label: 'Daily journal', active: true },
        { icon: Star, label: 'Experimental Me' },
        { icon: FileText, label: 'Movie database' },
        { icon: CheckSquare, label: 'Recipe book' },
        { icon: Globe, label: 'Course list' },
        { icon: Briefcase, label: 'My Important Documents' },
        { icon: Map, label: 'Travel planner' },
        { icon: LayoutGrid, label: 'Strategic thinking' },
    ];

    const diaryEntries = [
        {
            day: "1 June 2022",
            weekday: "Wednesday",
            title: "Reflections & Systems",
            content: [
                "Video call with nieces",
                "Too many meetings",
                "Great conversations with my dog",
                "Every breath a new beginning"
            ],
            tags: ["Family", "Work"]
        },
        {
            day: "2 June 2023",
            weekday: "Thursday",
            title: "Sensory Overload",
            content: [
                "Fresh cherries from the market",
                "Waking up in the night with hunger",
                "Long summer evenings",
                "Hot water and cold water are just water"
            ],
            tags: ["Food", "Summer"]
        },
        {
            day: "3 June 2023",
            weekday: "Friday",
            title: "Coffee & Anxiety",
            content: [
                "Conversing with a stranger",
                "Worrying about sleep",
                "Allergy medication",
                "The words come more easily when you're not caffeinated"
            ],
            tags: ["Social", "Health"]
        },
        {
            day: "4 June 2022",
            weekday: "Saturday",
            title: "Slow Living",
            content: [
                "Not getting outside",
                "Letting myself sleep in",
                "Long summer days",
                "Reading three chapters of sci-fi"
            ],
            tags: ["Rest", "Reading"]
        },
        {
            day: "5 June 2023",
            weekday: "Sunday",
            title: "Domestic Bliss",
            content: [
                "Buying flowers for mom",
                "Scrolling social media",
                "Morning cuddles",
                "Cleaning the workspace"
            ],
            tags: ["Home", "Family"]
        },
        {
            day: "6 June 2023",
            weekday: "Monday",
            title: "Deep Work",
            content: [
                "Fixed the navigation bug",
                "Reviewing pull requests",
                "Need to buy new headphones",
                "Focus mode: ON"
            ],
            tags: ["Dev", "Work"]
        }
    ];

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#191919',
            color: '#e0e0e0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Left Sidebar - Replicating the 'Notion' styled sidebar */}
            <aside style={{
                width: '260px', // Slightly wider
                backgroundColor: '#202020',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #333',
                padding: '20px 0',
                flexShrink: 0
            }} className="sidebar-desktop">

                {/* User Profile Area */}
                <div style={{ padding: '0 20px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', fontWeight: 'bold' }}>SJ</div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#d4d4d4' }}>Sarah's Space</span>
                    <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </div>

                {/* Home Section */}
                <div style={{ padding: '0 12px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '12px', paddingLeft: '8px' }}>Home</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {sidebarItems.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                backgroundColor: item.active ? 'rgba(255,255,255,0.08)' : 'transparent',
                                color: item.active ? '#fff' : '#999',
                                fontSize: '14px'
                            }}>
                                <item.icon size={18} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bookmarks Section */}
                <div style={{ padding: '0 12px', marginTop: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '8px' }}>
                        <span>Bookmarks</span>
                        <ChevronDown size={14} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', gap: '12px', padding: '8px 12px', alignItems: 'center' }}>
                            <div style={{ width: '20px', height: '20px', background: '#333', borderRadius: '4px', flexShrink: 0 }}></div>
                            <div style={{ fontSize: '13px', color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>The Internet Is Broken...</div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', padding: '8px 12px', alignItems: 'center' }}>
                            <div style={{ width: '20px', height: '20px', background: '#333', borderRadius: '4px', flexShrink: 0 }}></div>
                            <div style={{ fontSize: '13px', color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>A Brutally Honest Rev...</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', padding: '0 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#888', fontSize: '14px' }}>
                        <LayoutGrid size={18} /> Library
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#888', fontSize: '14px' }}>
                        <Trash2 size={18} /> Bin
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

                {/* Top Bar */}
                <div style={{
                    height: '60px', // Taller top bar
                    padding: '0 30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    color: '#999'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sidebar size={20} style={{ cursor: 'pointer' }} />
                        <span>Daily Journal</span>
                        {/* Back to Home Button added for usability */}
                        <span
                            onClick={() => navigate('/')}
                            style={{
                                marginLeft: '30px',
                                cursor: 'pointer',
                                color: 'var(--accent-primary, #d946ef)',
                                background: 'rgba(255,255,255,0.08)',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500
                            }}>
                            ← Portfolio
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                        <span>Synced</span>
                        <MoreHorizontal size={20} />
                    </div>
                </div>

                {/* Content Container */}
                <div style={{
                    maxWidth: '1400px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '20px 60px 80px' // Increased padding
                }}>

                    {/* Banner Image */}
                    <div style={{
                        width: '100%',
                        height: '280px', // Taller banner
                        backgroundColor: '#A88B35',
                        borderRadius: '8px',
                        marginBottom: '30px', // Reduced from 60px
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #b45309, #fbbf24)', opacity: 0.8 }}>
                            {/* Decorative lines to resemble the book in the image */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '340px',
                                height: '200px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                display: 'flex'
                            }}>
                                <div style={{ flex: 1, borderRight: '2px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '20px', padding: '25px' }}>
                                    <div style={{ width: '80%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                                    <div style={{ width: '90%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                                    <div style={{ width: '85%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', padding: '25px' }}>
                                    <div style={{ width: '80%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                                    <div style={{ width: '90%', height: '3px', background: 'rgba(0,0,0,0.2)' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Title Area */}
                    <div style={{ marginBottom: '30px' }}> {/* Reduced from 60px */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                            <PenTool size={42} color="#fff" />
                            <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Daily journal</h1>
                        </div>
                        <p style={{ color: '#999', fontSize: '18px', marginTop: '10px', maxWidth: '800px', lineHeight: 1.6 }}>
                            The act of thinking about my life and writing it down each day
                        </p>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', fontSize: '14px', color: '#666' }}>
                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Set</span>
                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Object type: Diary Entry</span>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px', // Reduced from 40px
                        borderBottom: '1px solid #333',
                        paddingBottom: '15px'
                    }}>
                        <div style={{ display: 'flex', gap: '32px', fontSize: '16px', color: '#888', fontWeight: 500 }}>
                            {['June', 'May', 'April', 'March', 'February'].map(month => (
                                <span
                                    key={month}
                                    style={{
                                        color: activeTab === month ? '#fff' : '#888',
                                        borderBottom: activeTab === month ? '2px solid #fff' : 'none',
                                        paddingBottom: '15px',
                                        marginBottom: '-16px', // Align border
                                        cursor: 'pointer',
                                        transition: 'color 0.2s'
                                    }}
                                    onClick={() => setActiveTab(month)}
                                >
                                    {month}
                                </span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ padding: '8px', cursor: 'pointer', color: '#888', transition: 'color 0.2s' }}><Filter size={18} /></div>
                            <div style={{ padding: '8px', cursor: 'pointer', color: '#888', transition: 'color 0.2s' }}><ArrowUpDown size={18} /></div>
                            <div style={{ padding: '8px', cursor: 'pointer', color: '#888', transition: 'color 0.2s' }}><Search size={18} /></div>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#333', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}>
                                <Smile size={16} color="#888" />
                            </div>
                            <button style={{
                                backgroundColor: '#fff',
                                color: 'black',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginLeft: '12px'
                            }}>
                                New
                            </button>
                        </div>
                    </div>

                    {/* Card Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px' // Increased Grid Gap
                    }}>
                        {diaryEntries.map((entry, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -4, borderColor: '#555' }}
                                style={{
                                    backgroundColor: '#202020',
                                    borderRadius: '12px',
                                    padding: '24px', // Increased card padding
                                    border: '1px solid #333',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    minHeight: '180px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                }}
                                className="journal-card"
                            >
                                <div style={{ fontSize: '15px', fontWeight: 700, color: '#e5e5e5', marginBottom: '8px' }}>
                                    {entry.day}
                                </div>
                                <div style={{ fontSize: '13px', color: '#ca8a04', marginBottom: '16px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                    {entry.weekday}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                    {entry.content.map((line, i) => (
                                        <div key={i} style={{ fontSize: '14px', color: '#a3a3a3', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <span style={{ color: '#444', marginTop: '4px' }}>•</span> {line}
                                        </div>
                                    ))}
                                </div>

                                {/* Optional Tags line */}
                                <div style={{ marginTop: '25px', display: 'flex', gap: '8px' }}>
                                    {entry.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '100px', color: '#888', border: '1px solid rgba(255,255,255,0.05)' }}>#{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </main>

            <style>{`
          .sidebar-desktop {
              transition: transform 0.3s ease;
          }
          @media (max-width: 768px) {
              .sidebar-desktop {
                  display: none !important;
              }
              .journal-card:hover {
                  border-color: #666;
              }
          }
      `}</style>
        </div>
    );
};

export default DiaryPage;
