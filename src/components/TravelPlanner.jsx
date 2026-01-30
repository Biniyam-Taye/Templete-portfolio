import React from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const TravelPlanner = () => {
    const trips = [
        { title: "Japan Trip", date: "April 2024", status: "Planning", image: "linear-gradient(135deg, #f9a8d4, #f472b6)" },
        { title: "Weekend Getaway", date: "Next Month", status: "Booked", image: "linear-gradient(135deg, #4ade80, #22c55e)" },
        { title: "Eurotrip", date: "Summer 2025", status: "Idea", image: "linear-gradient(135deg, #60a5fa, #3b82f6)" },
    ];

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#0d9488', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #115e59, #2dd4bf)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                    <Map size={42} color="#fff" />
                    <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Travel planner</h1>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Itineraries, bookings, and dream destinations.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {trips.map((item, idx) => (
                    <motion.div key={idx} whileHover={{ y: -4, borderColor: '#555' }} style={{ backgroundColor: '#202020', borderRadius: '12px', border: '1px solid #333', cursor: 'pointer', overflow: 'hidden' }}>
                        <div style={{ height: '140px', background: item.image, width: '100%' }}></div>
                        <div style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '5px' }}>{item.title}</h3>
                            <div style={{ fontSize: '14px', color: '#a3a3a3', marginBottom: '15px' }}>{item.date}</div>
                            <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '4px', color: '#e5e5e5' }}>{item.status}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
};
export default TravelPlanner;
