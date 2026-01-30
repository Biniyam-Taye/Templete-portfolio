import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, File } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const ImportantDocuments = () => {
    const docs = [
        { title: "Passport Copy.pdf", cat: "Identity", size: "1.2 MB" },
        { title: "Insurance Policy.pdf", cat: "Finance", size: "3.4 MB" },
        { title: "Vaccination Records.jpg", cat: "Health", size: "0.8 MB" },
        { title: "Resume_2024.pdf", cat: "Career", size: "0.5 MB" },
        { title: "Vehicle Registration.pdf", cat: "Asset", size: "1.1 MB" },
    ];

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#334155', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #1e293b, #64748b)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                    <Briefcase size={42} color="#fff" />
                    <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>My Important Documents</h1>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Secure storage for essential files.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                {docs.map((item, idx) => (
                    <motion.div key={idx} whileHover={{ y: -4, borderColor: '#555' }} style={{ backgroundColor: '#202020', borderRadius: '12px', padding: '24px', border: '1px solid #333', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                            <File size={24} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#e5e5e5', marginBottom: '8px', wordBreak: 'break-all' }}>{item.title}</h3>
                        <span style={{ fontSize: '12px', color: '#666' }}>{item.cat} • {item.size}</span>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
};
export default ImportantDocuments;
