import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanPage = () => {
    const navigate = useNavigate();
    // Categories based on the design
    const categories = [
        { id: 'brain-dump', title: 'Brain Dump', subtitle: 'Quick ideas', color: '#be185d', gradient: 'linear-gradient(135deg, #be185d, #db2777)' },
        { id: 'intention', title: "Today's Intention", subtitle: 'Focus', color: '#10b981', gradient: 'linear-gradient(135deg, #059669, #10b981)' },
        { id: 'weekly', title: 'Weekly Goals', subtitle: 'Priorities', color: '#b91c1c', gradient: 'linear-gradient(135deg, #b91c1c, #dc2626)' },
        { id: 'morning', title: '6am Rise + Shine', subtitle: 'Morning Routine', color: '#d97706', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)' },
        { id: 'workout', title: '6:15am Workout', subtitle: 'Health', color: '#a16207', gradient: 'linear-gradient(135deg, #a16207, #ca8a04)' },
        { id: 'relax', title: '9pm Relax + Unwind', subtitle: 'Rest', color: '#431407', gradient: 'linear-gradient(135deg, #431407, #78350f)' },
        { id: 'content', title: 'Content Plan', subtitle: 'Creation', color: '#3f6212', gradient: 'linear-gradient(135deg, #3f6212, #65a30d)' },
        { id: 'money', title: 'Finance', subtitle: 'Budget', color: '#15803d', gradient: 'linear-gradient(135deg, #15803d, #16a34a)' },
    ];

    const [tasks, setTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', category: 'brain-dump', time: '', date: new Date().toISOString().split('T')[0] });

    // Load tasks from local storage
    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('planner_tasks') || '[]');
        if (savedTasks.length === 0) {
            // Add some mock data if empty matching the screenshot
            const mocks = [
                { id: 1, title: 'Moonlit University (Skool) | Week 01: Curriculum & Content', category: 'morning', time: 'Sun, Oct 5', completed: false, date: '2024-10-05' },
                { id: 2, title: 'Create — TikTok + IG (Lunar Line Studios) • Merch Post', category: 'content', time: 'Sat, Oct 4 11:30 AM', completed: false, date: '2024-10-04' },
                { id: 3, title: 'HighkeyRaeAF (Daily Chaos Brand) • Stay consistent', category: 'weekly', time: 'Sun, Oct 5', completed: false, date: '2024-10-05' },
                { id: 4, title: 'HighkeyRaeAF (Lemon8) • Soft Reset Story', category: 'content', time: 'Yesterday 10:00 AM', completed: true, date: '2024-10-03' },
            ];
            setTasks(mocks);
        } else {
            setTasks(savedTasks);
        }
    }, []);

    // Save tasks to local storage
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('planner_tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    const handleAddTask = () => {
        if (!newTask.title) return;
        const task = {
            id: Date.now(),
            ...newTask,
            completed: false
        };
        setTasks([task, ...tasks]);
        setIsAddModalOpen(false);
        setNewTask({ title: '', category: 'brain-dump', time: '', date: new Date().toISOString().split('T')[0] });
    };

    const toggleComplete = (id) => {
        const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        setTasks(updated);
    };

    const countTasks = (catId) => tasks.filter(t => t.category === catId && !t.completed).length;

    const filteredTasks = activeFilter === 'All'
        ? tasks
        : tasks.filter(t => t.category === activeFilter);

    // Group tasks by Date
    const groupedTasks = {
        'Today': filteredTasks.filter(t => !t.completed),
        'Completed': filteredTasks.filter(t => t.completed)
    };

    return (
        <div className="plan-page-root" style={{ backgroundColor: '#191919', minHeight: '100vh', padding: '40px', fontFamily: "'Inter', sans-serif" }}>

            {/* Header with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginRight: '20px',
                        cursor: 'pointer',
                        color: '#e0e0e0',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        transition: 'all 0.2s'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 style={{ color: '#fff', margin: 0, fontSize: '28px', fontWeight: 'bold', fontFamily: "'Inter', sans-serif" }}>Plan & Routines</h1>
            </div>

            <div className="plan-layout" style={{ display: 'flex', gap: '40px', height: 'calc(100vh - 140px)', color: '#fff' }}>

                {/* Left Column - Categories */}
                <div className="plan-sidebar" style={{ width: '380px', flexShrink: 0, overflowY: 'auto', paddingRight: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: "'Inter', sans-serif" }}>Categories</h2>
                        <button onClick={() => setIsAddModalOpen(true)} style={{ background: '#333', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={18} /></button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setActiveFilter('All')}
                            style={{
                                padding: '16px',
                                backgroundColor: activeFilter === 'All' ? '#fff' : '#1e1e1e',
                                color: activeFilter === 'All' ? '#000' : '#fff',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                border: '1px solid #333'
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>All Tasks</h3>
                            <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: '14px' }}>{tasks.filter(t => !t.completed).length} active</p>
                        </motion.div>

                        {categories.map(cat => (
                            <motion.div
                                key={cat.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setActiveFilter(cat.id)}
                                style={{
                                    padding: '20px',
                                    background: cat.gradient,
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    border: activeFilter === cat.id ? '2px solid #fff' : 'none',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                }}
                            >
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.2)', fontFamily: "'Inter', sans-serif" }}>{cat.title}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '13px', opacity: 0.9, fontWeight: 500 }}>
                                    <span>{countTasks(cat.id)} tasks</span>
                                    <span>{cat.subtitle}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Task Timeline */}
                <div className="plan-content" style={{ flex: 1, backgroundColor: '#000', borderRadius: '24px', padding: '30px', overflowY: 'auto', border: '1px solid #222' }}>

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, fontFamily: "'Inter', sans-serif" }}>Next 7 Days</h2>
                            <p style={{ color: '#666', marginTop: '5px' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ background: '#222', border: '1px solid #333', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Scheduled</button>

                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                                    style={{ background: '#222', border: '1px solid #333', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Options
                                </button>
                                {isOptionsOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: '0',
                                        marginTop: '5px',
                                        background: '#222',
                                        border: '1px solid #333',
                                        borderRadius: '8px',
                                        padding: '5px',
                                        width: '180px',
                                        zIndex: 100,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                    }}>
                                        <div style={{ padding: '10px', fontSize: '14px', color: '#ccc', cursor: 'pointer', borderRadius: '4px' }} className="hover-option">Show Completed</div>
                                        <div style={{ padding: '10px', fontSize: '14px', color: '#ccc', cursor: 'pointer', borderRadius: '4px' }} className="hover-option">Sort by Priority</div>
                                        <div style={{ padding: '10px', fontSize: '14px', color: '#ccc', cursor: 'pointer', borderRadius: '4px' }} className="hover-option">Clear All Tasks</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active Tasks */}
                    <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontFamily: "'Inter', sans-serif" }}>Active</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {groupedTasks['Today'].length === 0 && <p style={{ color: '#444', fontStyle: 'italic' }}>No active tasks. Time to relax!</p>}
                        {groupedTasks['Today'].map(task => {
                            const cat = categories.find(c => c.id === task.category) || categories[0];
                            return (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        display: 'flex',
                                        gap: '15px',
                                        padding: '16px',
                                        backgroundColor: '#111',
                                        borderRadius: '12px',
                                        borderLeft: `6px solid ${cat.color}`,
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <div
                                        onClick={() => toggleComplete(task.id)}
                                        style={{
                                            width: '24px', height: '24px',
                                            borderRadius: '50%', border: '2px solid #444',
                                            cursor: 'pointer', flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    ></div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', lineHeight: '1.4', color: '#e5e5e5', fontFamily: "'Inter', sans-serif" }}>{task.title}</h4>
                                        <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#666' }}>
                                            <span style={{ color: cat.color, fontWeight: 600 }}>{cat.title}</span>
                                            <span>•</span>
                                            <span>{task.time || task.date}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const updated = tasks.filter(t => t.id !== task.id);
                                            setTasks(updated);
                                            // Make sure to add this deletion to bin
                                            const binItems = JSON.parse(localStorage.getItem('bin_items') || '[]');
                                            binItems.unshift({
                                                id: Date.now(),
                                                source: 'plan',
                                                deletedAt: new Date().toISOString(),
                                                data: task
                                            });
                                            localStorage.setItem('bin_items', JSON.stringify(binItems));
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Completed Tasks */}
                    {groupedTasks['Completed'].length > 0 && (
                        <>
                            <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', margin: '40px 0 15px', fontFamily: "'Inter', sans-serif" }}>Completed</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {groupedTasks['Completed'].map(task => {
                                    const cat = categories.find(c => c.id === task.category) || categories[0];
                                    return (
                                        <motion.div
                                            key={task.id}
                                            style={{
                                                display: 'flex',
                                                gap: '15px',
                                                padding: '16px',
                                                backgroundColor: '#0a0a0a',
                                                borderRadius: '12px',
                                                border: '1px solid #222',
                                                alignItems: 'center',
                                                opacity: 0.6
                                            }}
                                        >
                                            <div
                                                onClick={() => toggleComplete(task.id)}
                                                style={{
                                                    width: '24px', height: '24px',
                                                    borderRadius: '50%', background: '#22c55e',
                                                    cursor: 'pointer', flexShrink: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                <Check size={14} color="#000" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', textDecoration: 'line-through', color: '#666', fontFamily: "'Inter', sans-serif" }}>{task.title}</h4>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Fab Add Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAddModalOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#d946ef',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(217, 70, 239, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50
                }}
            >
                <Plus size={32} />
            </motion.button>

            {/* Add Task Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                    }}>
                        <motion.div
                            className="plan-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                width: '500px', backgroundColor: '#1a1a1a',
                                borderRadius: '16px', padding: '30px',
                                border: '1px solid #333', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                            }}
                        >
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>Add New Task</h2>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '14px' }}>Task Description</label>
                                <textarea
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="What needs to be done?"
                                    style={{
                                        width: '100%', height: '80px', background: '#111',
                                        border: '1px solid #333', borderRadius: '8px',
                                        color: '#fff', padding: '12px', fontSize: '16px', outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '14px' }}>Category</label>
                                    <select
                                        value={newTask.category}
                                        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                        style={{
                                            width: '100%', background: '#111', border: '1px solid #333',
                                            borderRadius: '8px', color: '#fff', padding: '10px', outline: 'none'
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '14px' }}>Time / Note</label>
                                    <input
                                        type="text"
                                        value={newTask.time}
                                        onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                        placeholder="e.g. 10:00 AM"
                                        style={{
                                            width: '100%', background: '#111', border: '1px solid #333',
                                            borderRadius: '8px', color: '#fff', padding: '10px', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    style={{
                                        background: 'transparent', color: '#888', border: 'none',
                                        padding: '10px 20px', cursor: 'pointer', fontSize: '14px'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTask}
                                    style={{
                                        background: '#fff', color: '#000', border: 'none',
                                        padding: '10px 24px', borderRadius: '8px',
                                        cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
                                    }}
                                >
                                    Add Task
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .hover-option:hover {
                    background-color: #333;
                    color: #fff !important;
                }
                @media (max-width: 768px) {
                    .plan-page-root {
                        padding: 20px !important;
                        height: auto !important;
                        overflow-y: auto !important;
                    }
                    .plan-layout {
                        flex-direction: column !important;
                        height: auto !important;
                        gap: 25px !important;
                    }
                    .plan-sidebar {
                        width: 100% !important;
                        padding-right: 0 !important;
                        overflow-y: visible !important;
                        margin-bottom: 10px;
                    }
                    .plan-content {
                        width: 100% !important;
                        padding: 20px !important;
                        overflow-y: visible !important;
                        height: auto !important;
                        min-height: 400px;
                    }
                    /* Modal Responsive */
                    .plan-modal {
                        width: 90% !important;
                        padding: 20px !important;
                        max-height: 90vh;
                        overflow-y: auto;
                    }
                }
            `}</style>
        </div >
    );
};

export default PlanPage;
