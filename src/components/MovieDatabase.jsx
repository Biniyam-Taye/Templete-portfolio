import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const MovieDatabase = () => {
    const movies = [
        { title: "Everything Everywhere All At Once", rating: "5/5", genre: "Sci-Fi", watched: "2023" },
        { title: "Dune: Part Two", rating: "4.8/5", genre: "Sci-Fi", watched: "2024" },
        { title: "Past Lives", rating: "5/5", genre: "Romance", watched: "2023" },
        { title: "Oppenheimer", rating: "4.5/5", genre: "Biography", watched: "2023" },
    ];

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#be123c', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #9f1239, #fb7185)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                    <FileText size={42} color="#fff" />
                    <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Movie database</h1>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>A collection of films watched and to watch.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                {movies.map((item, idx) => (
                    <motion.div key={idx} whileHover={{ y: -4, borderColor: '#555' }} style={{ backgroundColor: '#202020', borderRadius: '12px', padding: '24px', border: '1px solid #333', cursor: 'pointer' }}>
                        <div style={{ width: '100%', height: '120px', background: '#333', borderRadius: '6px', marginBottom: '16px' }}></div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{item.title}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '14px', color: '#888' }}>
                            <span>{item.genre}</span>
                            <span style={{ color: '#fbbf24' }}>★ {item.rating}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
};
export default MovieDatabase;
