import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const CourseList = () => {
    const courses = [
        { title: "Advanced React Patterns", platform: "Frontend Masters", progress: 80 },
        { title: "Rust for Beginners", platform: "Udemy", progress: 15 },
        { title: "UI/UX Design Fundamentals", platform: "Coursera", progress: 100 },
        { title: "System Design Interview", platform: "Youtube", progress: 45 },
    ];

    return (
        <DashboardLayout>
            <div style={{ width: '100%', height: '280px', backgroundColor: '#0369a1', borderRadius: '8px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #075985, #38bdf8)', opacity: 0.8 }} />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                    <Globe size={42} color="#fff" />
                    <h1 style={{ fontSize: '48px', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Course list</h1>
                </div>
                <p style={{ color: '#999', fontSize: '18px', marginTop: '10px' }}>Continuous learning and skill acquisition.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {courses.map((item, idx) => (
                    <motion.div key={idx} whileHover={{ x: 4, borderColor: '#555' }} style={{ backgroundColor: '#202020', borderRadius: '12px', padding: '20px', border: '1px solid #333', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{item.title}</h3>
                            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{item.platform}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '100px', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${item.progress}%`, height: '100%', background: item.progress === 100 ? '#22c55e' : '#38bdf8' }}></div>
                            </div>
                            <span style={{ fontSize: '13px', color: '#ccc', width: '30px', textAlign: 'right' }}>{item.progress}%</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
};
export default CourseList;
