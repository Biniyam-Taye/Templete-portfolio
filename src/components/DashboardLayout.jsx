import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid, ChevronDown, Book, FileText, Globe,
    Briefcase, Map, Trash2, Sidebar, Star, CheckSquare,
    MoreHorizontal, ArrowLeft, LogOut, Shield, X, Menu
} from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAdminAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const renderSidebarContent = () => (
        <>
            {/* User Profile Area */}
            <div style={{ padding: '0 20px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                    <Shield size={18} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#d4d4d4' }}>Admin Space</span>
                <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </div>

            {/* Home Section */}
            <div style={{ padding: '0 12px', marginBottom: '20px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#888', marginBottom: '12px', paddingLeft: '8px' }}>Home</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {sidebarItems.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div key={idx}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMobileMenuOpen(false);
                                }}
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

            <div style={{ marginTop: 'auto', padding: '0 12px' }}>
                <div
                    onClick={() => {
                        navigate('/library');
                        setIsMobileMenuOpen(false);
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        color: location.pathname === '/library' ? '#fff' : '#888',
                        backgroundColor: location.pathname === '/library' ? 'rgba(255,255,255,0.08)' : 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    <LayoutGrid size={18} /> Library
                </div>
                <div
                    onClick={() => {
                        navigate('/bin');
                        setIsMobileMenuOpen(false);
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        color: location.pathname === '/bin' ? '#fff' : '#888',
                        backgroundColor: location.pathname === '/bin' ? 'rgba(255,255,255,0.08)' : 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    <Trash2 size={18} /> Bin
                </div>
                <div
                    onClick={() => {
                        navigate('/settings');
                        setIsMobileMenuOpen(false);
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        color: location.pathname === '/settings' ? '#fbbf24' : '#888',
                        backgroundColor: location.pathname === '/settings' ? 'rgba(251,191,36,0.08)' : 'transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    <Shield size={18} /> Settings
                </div>
                <div
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        color: '#ef4444',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginTop: '10px'
                    }}
                >
                    <LogOut size={18} /> Logout
                </div>
            </div>
        </>
    );

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#191919',
            color: '#e0e0e0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Desktop Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#202020',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #333',
                padding: '20px 0',
                flexShrink: 0
            }} className="sidebar-desktop">
                {renderSidebarContent()}
            </aside>

            {/* Mobile Sidebar Overlay & Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMobileMenu}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 100
                            }}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: '280px',
                                backgroundColor: '#202020',
                                zIndex: 101,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '20px 0',
                                boxShadow: '20px 0 50px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '20px', right: '15px' }}>
                                <button onClick={toggleMobileMenu} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            {renderSidebarContent()}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

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
                    color: '#999',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#191919',
                    zIndex: 90
                }} className="top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="desktop-sidebar-icon" style={{ display: 'flex', alignItems: 'center' }}>
                            <Sidebar size={20} style={{ cursor: 'pointer' }} />
                        </div>
                        
                        <div className="desktop-breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>Admin Space</span>
                            <span style={{ color: '#666' }}>/</span>
                            <span style={{ color: '#e0e0e0' }}>{sidebarItems.find(i => i.path === location.pathname)?.label || 'Page'}</span>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                marginLeft: '10px',
                                cursor: 'pointer',
                                color: '#e0e0e0',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px'
                            }}
                            title="Back to Portfolio Home"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div className="status-indicator" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                            <span className="status-text">Synced</span>
                        </div>
                        <MoreHorizontal size={20} className="desktop-more-icon" />
                        
                        {/* Hamburger Menu - Visible only on mobile */}
                        <button 
                            onClick={toggleMobileMenu}
                            className="mobile-menu-toggle"
                            style={{ 
                                background: 'rgba(251,191,36,0.1)', 
                                border: '1px solid rgba(251,191,36,0.2)', 
                                color: '#fbbf24', 
                                cursor: 'pointer',
                                display: 'none',
                                padding: '8px',
                                borderRadius: '8px'
                            }}
                        >
                            <Menu size={22} />
                        </button>
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
                    .mobile-menu-toggle {
                        display: block !important;
                    }
                    .desktop-sidebar-icon {
                        display: none !important;
                    }
                    .dashboard-content-wrapper {
                        padding: 20px 15px 80px !important;
                    }
                    .desktop-breadcrumbs {
                        display: none !important;
                    }
                    .status-text {
                        display: none !important;
                    }
                    .desktop-more-icon {
                        display: none !important;
                    }
                    .top-bar {
                        padding: 0 15px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
