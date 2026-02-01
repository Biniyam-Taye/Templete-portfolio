import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { settingsApi } from '../utils/api';
import { useAdminAuth } from '../context/AuthContext';

const SettingsPage = () => {
    const { forceLoginState } = useAdminAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 4) {
            setStatus({ type: 'error', message: 'Password must be at least 4 characters long' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        setIsSaving(true);
        setStatus({ type: '', message: '' });

        try {
            await settingsApi.updatePassword(newPassword);
            // After updating on server, we also need to update it in our local storage
            // so we don't get logged out immediately.
            forceLoginState(newPassword);
            
            setStatus({ type: 'success', message: 'Secret key updated successfully!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to update secret key. Make sure you are authorized.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                        <Shield size={32} color="#fbbf24" />
                        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', margin: 0 }}>Security Settings</h1>
                    </div>
                    <p style={{ color: '#999', fontSize: '16px' }}>
                        Manage your administrative access and secret keys.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: '#202020',
                        borderRadius: '16px',
                        padding: '30px',
                        border: '1px solid #333',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                >
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={18} /> Change Admin Secret Key
                    </h2>

                    <form onSubmit={handleUpdatePassword}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '14px' }}>New Secret Key</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new secret key"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: '#111',
                                    border: '1px solid #333',
                                    color: '#fff',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                onBlur={(e) => e.target.style.borderColor = '#333'}
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '14px' }}>Confirm Secret Key</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new secret key"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: '#111',
                                    border: '1px solid #333',
                                    color: '#fff',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                                onBlur={(e) => e.target.style.borderColor = '#333'}
                            />
                        </div>

                        {status.message && (
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                color: status.type === 'error' ? '#ef4444' : '#22c55e',
                                border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                                fontSize: '14px'
                            }}>
                                {status.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSaving}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '8px',
                                backgroundColor: '#fbbf24',
                                color: '#000',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                opacity: isSaving ? 0.7 : 1,
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!isSaving) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 10px 20px rgba(251, 191, 36, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <Save size={18} />
                            {isSaving ? 'Updating...' : 'Update Secret Key'}
                        </button>
                    </form>
                </motion.div>

                <div style={{ marginTop: '40px', padding: '20px', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.1)', backgroundColor: 'rgba(251, 191, 36, 0.02)' }}>
                    <h3 style={{ color: '#fbbf24', fontSize: '14px', fontWeight: 600, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Security Note</h3>
                    <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                        The "Secret Key" acts as your master password for the administrative section of your portfolio. 
                        Changing it will immediately require you to use the new key for any future logins.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
