import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutGrid, ChevronDown, Book, FileText, Globe,
    Briefcase, Map, Trash2, Sidebar, Star, CheckSquare,
    MoreHorizontal
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        { icon: Book, label: 'Daily journal', path: '/diary' },
        { icon: Star, label: 'Experimental Me', path: '/experimental-me' },
        { icon: FileText, label: 'Movie database', path: '/movies' },
        { icon: CheckSquare, label: 'Recipe book', path: '/recipes' },
        { icon: Globe, label: 'Course list', path: '/courses' },
        { icon: Briefcase, label: 'My Important Documents', path: '/documents' },
        { icon: Map, label: 'Travel planner', path: '/travel' },
        { icon: LayoutGrid, label: 'Strategic thinking', path: '/strategy' },
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
                width: '260px',
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
                        {sidebarItems.map((item, idx) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <div key={idx}
                                    onClick={() => navigate(item.path)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        color: isActive ? '#fff' : '#999',
                                        fontSize: '14px',
                                        transition: 'background-color 0.2s, color 0.2s'
                                    }}>
                                    <item.icon size={18} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                                </div>
                            );
                        })}
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
                    height: '60px',
                    padding: '0 30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    color: '#999'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sidebar size={20} style={{ cursor: 'pointer' }} />
                        {/* Dynamically show breadcrumb based on path could go here, or just static for now */}
                        <span>Sarah's Space</span>
                        <span style={{ color: '#666' }}>/</span>
                        <span style={{ color: '#e0e0e0' }}>{sidebarItems.find(i => i.path === location.pathname)?.label || 'Page'}</span>

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

                {/* Content Children */}
                <div style={{
                    maxWidth: '1400px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '20px 60px 80px'
                }}>
                    {children}
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
          }
      `}</style>
        </div>
    );
};

export default DashboardLayout;
