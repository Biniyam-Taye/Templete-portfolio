import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Clock, ChefHat, Tag, Image as ImageIcon, Upload, GripVertical, Trash2, Type, List, CheckSquare, ChevronRight, FileText } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const RecipeNewEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);

    // Form State
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [editId, setEditId] = useState(null);

    // Ingredients as blocks
    const [ingredients, setIngredients] = useState([{ id: Date.now().toString(), content: '' }]);

    // Instructions as blocks
    const [instructions, setInstructions] = useState([{ id: Date.now().toString(), type: 'paragraph', content: '' }]);

    // Initialize if editing
    useEffect(() => {
        if (location.state?.entry) {
            const { entry } = location.state;
            setEditId(entry.id);
            setTitle(entry.title || '');
            setDifficulty(entry.difficulty || 'Easy');
            setPrepTime(entry.prepTime || '');
            setCookTime(entry.cookTime || '');
            setServings(entry.servings || '');
            setTags(Array.isArray(entry.tags) ? entry.tags.join(', ') : (entry.tags || ''));
            setCoverImage(entry.coverImage || null);

            // Handle ingredients
            if (Array.isArray(entry.ingredients)) {
                setIngredients(entry.ingredients);
            } else if (typeof entry.ingredients === 'string' && entry.ingredients.trim() !== '') {
                setIngredients([{ id: Date.now().toString(), content: entry.ingredients }]);
            }

            // Handle instructions
            if (Array.isArray(entry.instructions)) {
                setInstructions(entry.instructions);
            } else if (typeof entry.instructions === 'string' && entry.instructions.trim() !== '') {
                setInstructions([{ id: Date.now().toString(), type: 'paragraph', content: entry.instructions }]);
            }
        }
    }, [location.state]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a recipe title');
            return;
        }

        const newEntry = {
            id: editId || Date.now(),
            title,
            difficulty,
            prepTime,
            cookTime,
            servings,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            coverImage,
            ingredients,
            instructions
        };

        const existingEntries = JSON.parse(localStorage.getItem('recipe_entries') || '[]');

        if (editId) {
            const updatedEntries = existingEntries.map(ent => ent.id === editId ? newEntry : ent);
            localStorage.setItem('recipe_entries', JSON.stringify(updatedEntries));
        } else {
            const updatedEntries = [newEntry, ...existingEntries];
            localStorage.setItem('recipe_entries', JSON.stringify(updatedEntries));
        }

        navigate('/recipes');
    };

    // Ingredient handlers
    const addIngredient = () => {
        setIngredients([...ingredients, { id: Date.now().toString(), content: '' }]);
    };

    const removeIngredient = (id) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter(i => i.id !== id));
        }
    };

    const updateIngredient = (id, value) => {
        setIngredients(ingredients.map(i => i.id === id ? { ...i, content: value } : i));
    };

    // Instruction block handlers
    const addInstruction = (type) => {
        setInstructions([...instructions, { id: Date.now().toString(), type, content: '', checked: false, title: '' }]);
    };

    const removeInstruction = (id) => {
        if (instructions.length > 1) {
            setInstructions(instructions.filter(i => i.id !== id));
        }
    };

    const updateInstruction = (id, field, value) => {
        setInstructions(instructions.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const difficultyColors = {
        'Easy': '#22c55e',
        'Medium': '#eab308',
        'Hard': '#ef4444'
    };

    const inputStyle = {
        width: '100%',
        background: 'transparent',
        border: 'none',
        color: '#e5e5e5',
        fontSize: '16px',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'none',
        padding: '0'
    };

    const toolbarBtnStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: 'none',
        color: '#ccc',
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        transition: 'all 0.2s',
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    accept="image/*"
                />

                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate('/recipes')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(0,0,0,0.5)', border: '1px solid #333', color: '#ccc',
                            cursor: 'pointer', fontSize: '14px', padding: '6px 12px', borderRadius: '6px',
                        }}
                    >
                        <ArrowLeft size={16} /> Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#fff', color: 'black', border: 'none',
                            padding: '8px 24px', borderRadius: '6px', fontSize: '14px',
                            fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        <Save size={16} /> {editId ? 'Update Recipe' : 'Save Recipe'}
                    </button>
                </div>

                {/* Cover Image */}
                <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        width: '100%', height: '300px',
                        backgroundColor: '#202020', borderRadius: '16px',
                        border: '1px dashed #444', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', position: 'relative',
                        backgroundImage: coverImage ? `url(${coverImage})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        marginBottom: '30px'
                    }}
                >
                    {!coverImage && (
                        <>
                            <ImageIcon size={48} color="#666" style={{ marginBottom: '10px' }} />
                            <span style={{ color: '#888', fontSize: '14px' }}>Upload Recipe Photo</span>
                        </>
                    )}
                    {coverImage && (
                        <div style={{
                            position: 'absolute', bottom: '15px', right: '15px',
                            background: 'rgba(0,0,0,0.7)', padding: '8px 16px',
                            borderRadius: '6px', color: 'white', fontSize: '13px',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <Upload size={14} /> Change Photo
                        </div>
                    )}
                </div>

                {/* Title */}
                <div style={{ marginBottom: '30px' }}>
                    <input
                        type="text"
                        placeholder="Recipe Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%', background: 'transparent', border: 'none',
                            fontSize: '42px', fontWeight: 700, color: '#fff',
                            outline: 'none', marginBottom: '10px'
                        }}
                    />
                </div>

                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #333' }}>
                    {/* Difficulty */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <ChefHat size={16} /> Difficulty
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['Easy', 'Medium', 'Hard'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    style={{
                                        background: difficulty === d ? difficultyColors[d] : 'rgba(255,255,255,0.05)',
                                        color: difficulty === d ? '#000' : '#888',
                                        border: 'none', padding: '6px 12px', borderRadius: '20px',
                                        fontSize: '13px', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time & Servings */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Clock size={18} color="#666" />
                            <input
                                type="text" placeholder="Prep Time (e.g. 15m)" value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Clock size={18} color="#666" />
                            <input
                                type="text" placeholder="Cook Time (e.g. 30m)" value={cookTime}
                                onChange={(e) => setCookTime(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ChefHat size={18} color="#666" />
                            <input
                                type="text" placeholder="Servings (e.g. 4)" value={servings}
                                onChange={(e) => setServings(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#e5e5e5', padding: '5px', outline: 'none', width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '120px', color: '#888' }}>
                            <Tag size={16} /> Tags
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. Breakfast, Vegan, Quick"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            style={{
                                background: 'transparent', border: 'none',
                                color: '#e0e0e0', fontSize: '14px', outline: 'none',
                                flex: 1
                            }}
                        />
                    </div>
                </div>

                {/* Ingredients Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '1px solid #333',
                        marginBottom: '30px'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #2a2a2a' }}>
                        <div style={{ display: 'flex', gap: '8px', color: '#666', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <List size={14} /> Ingredients
                        </div>
                        <button onClick={addIngredient} style={{ ...toolbarBtnStyle, background: '#252525', border: '1px solid #333' }}>
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {ingredients.map((ingredient) => (
                            <div key={ingredient.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }}></div>
                                <input
                                    type="text"
                                    placeholder="e.g. 2 cups flour"
                                    value={ingredient.content}
                                    onChange={(e) => updateIngredient(ingredient.id, e.target.value)}
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                                {ingredients.length > 1 && (
                                    <button
                                        onClick={() => removeIngredient(ingredient.id)}
                                        style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Instructions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '1px solid #333'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #2a2a2a' }}>
                        <div style={{ display: 'flex', gap: '8px', color: '#666', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <FileText size={14} /> Instructions
                        </div>
                        <div style={{ display: 'flex', gap: '6px', background: '#252525', padding: '6px', borderRadius: '8px', border: '1px solid #333' }}>
                            <button onClick={() => addInstruction('paragraph')} title="Text" style={toolbarBtnStyle}><Type size={16} /></button>
                            <button onClick={() => addInstruction('bullet')} title="List" style={toolbarBtnStyle}><List size={16} /></button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {instructions.map((block, index) => (
                            <div
                                key={block.id}
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'start',
                                    padding: '8px 0'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    {block.type === 'paragraph' && (
                                        <textarea
                                            placeholder={`Step ${index + 1}...`}
                                            value={block.content}
                                            onChange={(e) => updateInstruction(block.id, 'content', e.target.value)}
                                            style={{ ...inputStyle, minHeight: '24px' }}
                                            rows={1}
                                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                        />
                                    )}

                                    {block.type === 'bullet' && (
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                            <div style={{ marginTop: '9px', minWidth: '6px', height: '6px', borderRadius: '50%', background: '#fff' }}></div>
                                            <textarea
                                                placeholder="List item"
                                                value={block.content}
                                                onChange={(e) => updateInstruction(block.id, 'content', e.target.value)}
                                                style={{ ...inputStyle, minHeight: '24px' }}
                                                rows={1}
                                                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {instructions.length > 1 && (
                                    <button
                                        onClick={() => removeInstruction(block.id)}
                                        style={{ marginTop: '6px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default RecipeNewEntry;
