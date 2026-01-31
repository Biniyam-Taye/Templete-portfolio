import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutGrid, ChevronDown, Book, FileText, Globe,
    Briefcase, Map, Trash2, Sidebar, Star, CheckSquare,
    MoreHorizontal, ArrowLeft
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
                    <div
                        onClick={() => navigate('/library')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            color: location.pathname === '/library' ? '#fff' : '#888',
                            backgroundColor: location.pathname === '/library' ? 'rgba(255,255,255,0.08)' : 'transparent',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'background-color 0.2s, color 0.2s'
                        }}
                    >
                        <LayoutGrid size={18} /> Library
                    </div>
                    <div
                        onClick={() => navigate('/bin')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            color: location.pathname === '/bin' ? '#fff' : '#888',
                            backgroundColor: location.pathname === '/bin' ? 'rgba(255,255,255,0.08)' : 'transparent',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'background-color 0.2s, color 0.2s'
                        }}
                    >
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
                        {/* Desktop Breadcrumbs */}
                        <div className="desktop-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>Sarah's Space</span>
                            <span style={{ color: '#666' }}>/</span>
                            <span style={{ color: '#e0e0e0' }}>{sidebarItems.find(i => i.path === location.pathname)?.label || 'Page'}</span>
                        </div>

                        {/* Mobile Page Dropdown */}
                        <div className="mobile-page-select" style={{ display: 'none', alignItems: 'center', marginLeft: '5px', position: 'relative' }}>
                            <span style={{ marginRight: '5px', color: '#666' }}>/</span>
                            <select
                                value={location.pathname}
                                onChange={(e) => navigate(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    color: '#e0e0e0',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    // appearance: 'none', // Keep native arrow or override? Native is fine for "drop down icon"
                                    cursor: 'pointer',
                                    maxWidth: '150px'
                                }}
                            >
                                {sidebarItems.map(item => (
                                    <option key={item.path} value={item.path} style={{ color: '#000' }}>{item.label}</option>
                                ))}
                            </select>
                            {/* Force Chevron if appearance is none, but native is safer for visibility complaints. Stick to native unless requested. */}
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                marginLeft: '20px',
                                cursor: 'pointer',
                                color: '#e0e0e0',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                transition: 'all 0.2s'
                            }}
                            title="Back to Portfolio Home"
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <ArrowLeft size={18} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                        <span>Synced</span>
                        <MoreHorizontal size={20} />
                    </div>
                </div>

                {/* Content Children */}
                <div className="dashboard-content-wrapper" style={{
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
              .dashboard-content-wrapper {
                  padding: 20px 15px 80px !important;
              }
              /* Toggle Header Elements */
              .desktop-breadcrumbs {
                  display: none !important;
              }
              .mobile-page-select {
                  display: flex !important;
              }
          }
      `}</style>
        </div>
    );
};

export default DashboardLayout;
