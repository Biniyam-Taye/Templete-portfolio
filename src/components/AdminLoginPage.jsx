import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(key);
        if (success) {
            navigate('/diary');
        } else {
            setError('Invalid secret key');
            setKey('');
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111',
            color: '#fff',
            fontFamily: "'Inter', sans-serif"
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '40px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '24px',
                    border: '1px solid #333',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
            >
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: '#fbbf24',
                    border: '1px solid #333'
                }}>
                    <ShieldCheck size={32} />
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Admin Access</h1>
                <p style={{ color: '#888', marginBottom: '32px', fontSize: '14px' }}>Please enter your secret key to continue</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                        <input
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Enter secret key"
                            style={{
                                width: '100%',
                                padding: '16px 16px 16px 48px',
                                backgroundColor: '#0a0a0a',
                                border: '1px solid #333',
                                borderRadius: '12px',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '16px',
                                transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                            onBlur={(e) => e.target.style.borderColor = '#333'}
                        />
                    </div>

                    {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '20px' }}>{error}</p>}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#fff',
                            color: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        ACCESS SPACE <ArrowRight size={18} />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
