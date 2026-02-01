const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Cache for the secret key
let cachedSecretKey = process.env.ADMIN_SECRET_KEY || 'dominique2024';

// Function to ensure settings table exists and is seeded
const initializeSettings = async () => {
    try {
        await pool.query('CREATE TABLE IF NOT EXISTS settings (`key` VARCHAR(100) PRIMARY KEY, `value` TEXT)');
        
        const [rows] = await pool.query('SELECT value FROM settings WHERE `key` = "admin_secret_key"');
        const adminKey = process.env.ADMIN_SECRET_KEY || 'dominique2024';
        
        if (rows.length === 0) {
            await pool.query('INSERT INTO settings (`key`, `value`) VALUES ("admin_secret_key", ?)', [adminKey]);
            console.log('Admin key initialized in database.');
        } else if (rows[0].value !== adminKey) {
            // Force sync database with ENV file if they differ
            await pool.query('UPDATE settings SET value = ? WHERE `key` = "admin_secret_key"', [adminKey]);
            console.log('Database admin key synchronized with .env file.');
        }
        
        console.log('Settings table ready.');
        await refreshSecretKey();
    } catch (err) {
        console.error('Failed to initialize settings:', err);
    }
};

// Function to refresh secret key from DB
const refreshSecretKey = async () => {
    try {
        const [rows] = await pool.query('SELECT value FROM settings WHERE `key` = "admin_secret_key"');
        if (rows.length > 0) {
            cachedSecretKey = rows[0].value.trim();
            console.log('Secret key synchronized with database.');
        }
    } catch (err) {
        console.error('Failed to refresh secret key:', err);
    }
};

// Start initialization
initializeSettings();

// Simple Secret Key Authentication Middleware
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Check if the auth header exists and matches the secret key
    // Format: Bearer <secret_key>
    if (authHeader && authHeader.split(' ')[1] === cachedSecretKey) {
        next();
    } else {
        // One retry with a fresh key just in case it was changed
        await refreshSecretKey();
        if (authHeader && authHeader.split(' ')[1] === cachedSecretKey) {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized: Invalid or missing secret key' });
        }
    }
};

// --- Settings Endpoints (Outside /api to allow initial setup if needed, but here we protect it) ---
// Actually, let's put it in /api so it's protected by the OLD password before setting a NEW one.
app.put('/api/settings/password', authenticate, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
        return res.status(400).json({ error: 'Invalid password. Minimum 4 characters.' });
    }

    try {
        await pool.query("UPDATE settings SET value = ? WHERE \`key\` = 'admin_secret_key'", [newPassword]);
        cachedSecretKey = newPassword;
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Verification endpoint
app.get('/api/auth/verify', authenticate, (req, res) => {
    res.json({ valid: true, message: 'Authentication successful' });
});

// Debug log for authentication
console.log(`Server started. Secret key loaded (length: ${cachedSecretKey.length})`);

// Apply authentication to all /api routes
app.use('/api', authenticate);

// --- Diary Endpoints ---

app.get('/api/diary', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM diary_entries ORDER BY created_at DESC');
        // Parse JSON fields
        const entries = rows.map(row => ({
            ...row,
            content: JSON.parse(row.content),
            tags: JSON.parse(row.tags || '[]')
        }));
        res.json(entries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/diary', async (req, res) => {
    const { title, content, day, weekday, tags, coverImage } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO diary_entries (title, content, day, weekday, tags, coverImage) VALUES (?, ?, ?, ?, ?, ?)',
            [title, JSON.stringify(content), day, weekday, JSON.stringify(tags), coverImage]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/diary/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, day, weekday, tags, coverImage } = req.body;
    try {
        const [existing] = await pool.query('SELECT id FROM diary_entries WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Entry not found' });

        await pool.query(
            'UPDATE diary_entries SET title = ?, content = ?, day = ?, weekday = ?, tags = ?, coverImage = ? WHERE id = ?',
            [title, JSON.stringify(content), day, weekday, JSON.stringify(tags), coverImage, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/diary/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM diary_entries WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Plan Endpoints ---

app.get('/api/plans', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM planner_tasks ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/plans', async (req, res) => {
    const { title, category, time, date, completed } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO planner_tasks (title, category, time, date, completed) VALUES (?, ?, ?, ?, ?)',
            [title, category, time, date, completed ? 1 : 0]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/plans/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category, time, date, completed } = req.body;
    try {
        const [existing] = await pool.query('SELECT id FROM planner_tasks WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Task not found' });

        await pool.query(
            'UPDATE planner_tasks SET title = ?, category = ?, time = ?, date = ?, completed = ? WHERE id = ?',
            [title, category, time, date, completed ? 1 : 0, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/plans/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM planner_tasks WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/plans/clear-all', async (req, res) => {
    try {
        await pool.query('DELETE FROM planner_tasks');
        res.json({ message: 'All tasks cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Planner Category Endpoints ---

app.get('/api/planner-categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM planner_categories ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/planner-categories', async (req, res) => {
    const { slug, title, subtitle, color, gradient } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO planner_categories (slug, title, subtitle, color, gradient) VALUES (?, ?, ?, ?, ?)',
            [slug, title, subtitle, color, gradient]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Database error: ${err.message}` });
    }
});

app.put('/api/planner-categories/:id', async (req, res) => {
    const { id } = req.params;
    const { slug, title, subtitle, color, gradient } = req.body;
    try {
        await pool.query(
            'UPDATE planner_categories SET slug = ?, title = ?, subtitle = ?, color = ?, gradient = ? WHERE id = ?',
            [slug, title, subtitle, color, gradient, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Database error: ${err.message}` });
    }
});

app.delete('/api/planner-categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM planner_categories WHERE id = ?', [id]);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Experiment Endpoints ---
app.get('/api/experiments', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM experiments ORDER BY created_at DESC');
        const experiments = rows.map(row => ({
            ...row,
            tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
            notes: row.notes && row.notes.startsWith('[') ? JSON.parse(row.notes) : row.notes
        }));
        res.json(experiments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/experiments', async (req, res) => {
    const { title, status, tags, notes } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO experiments (title, status, tags, notes) VALUES (?, ?, ?, ?)',
            [title, status, JSON.stringify(tags), typeof notes === 'object' ? JSON.stringify(notes) : notes]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/experiments/:id', async (req, res) => {
    const { id } = req.params;
    const { title, status, tags, notes } = req.body;
    try {
        await pool.query(
            'UPDATE experiments SET title = ?, status = ?, tags = ?, notes = ? WHERE id = ?',
            [title, status, JSON.stringify(tags), typeof notes === 'object' ? JSON.stringify(notes) : notes, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/experiments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM experiments WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Movie Endpoints ---
app.get('/api/movies', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movies ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/movies', async (req, res) => {
    const { title, rating, genre, status, watched, coverImage } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO movies (title, rating, genre, status, watched, coverImage) VALUES (?, ?, ?, ?, ?, ?)',
            [title, rating, genre, status, watched, coverImage]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { title, rating, genre, status, watched, coverImage } = req.body;
    try {
        await pool.query(
            'UPDATE movies SET title = ?, rating = ?, genre = ?, status = ?, watched = ?, coverImage = ? WHERE id = ?',
            [title, rating, genre, status, watched, coverImage, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM movies WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Recipe Endpoints ---
app.get('/api/recipes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC');
        const recipes = rows.map(row => ({
            ...row,
            tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
        }));
        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/recipes', async (req, res) => {
    const { title, prepTime, cookTime, difficulty, tags, coverImage } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO recipes (title, prepTime, cookTime, difficulty, tags, coverImage) VALUES (?, ?, ?, ?, ?, ?)',
            [title, prepTime, cookTime, difficulty, JSON.stringify(tags), coverImage]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, prepTime, cookTime, difficulty, tags, coverImage } = req.body;
    try {
        await pool.query(
            'UPDATE recipes SET title = ?, prepTime = ?, cookTime = ?, difficulty = ?, tags = ?, coverImage = ? WHERE id = ?',
            [title, prepTime, cookTime, difficulty, JSON.stringify(tags), coverImage, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM recipes WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Course Endpoints ---
app.get('/api/courses', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/courses', async (req, res) => {
    const { title, platform, status, progress, link } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO courses (title, platform, status, progress, link) VALUES (?, ?, ?, ?, ?)',
            [title, platform, status, progress, link]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/courses/:id', async (req, res) => {
    const { id } = req.params;
    const { title, platform, status, progress, link } = req.body;
    try {
        await pool.query(
            'UPDATE courses SET title = ?, platform = ?, status = ?, progress = ?, link = ? WHERE id = ?',
            [title, platform, status, progress, link, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM courses WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Travel Endpoints ---
app.get('/api/travel', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM travel_plans ORDER BY created_at DESC');
        const travel = rows.map(row => ({
            ...row,
            activities: typeof row.activities === 'string' ? JSON.parse(row.activities) : row.activities
        }));
        res.json(travel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/travel', async (req, res) => {
    const { destination, dates, status, budget, activities } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO travel_plans (destination, dates, status, budget, activities) VALUES (?, ?, ?, ?, ?)',
            [destination, dates, status, budget, JSON.stringify(activities)]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/travel/:id', async (req, res) => {
    const { id } = req.params;
    const { destination, dates, status, budget, activities } = req.body;
    try {
        await pool.query(
            'UPDATE travel_plans SET destination = ?, dates = ?, status = ?, budget = ?, activities = ? WHERE id = ?',
            [destination, dates, status, budget, JSON.stringify(activities), id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/travel/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM travel_plans WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Strategy Endpoints ---
app.get('/api/strategy', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM strategic_plans ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/strategy', async (req, res) => {
    const { title, category, priority, content } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO strategic_plans (title, category, priority, content) VALUES (?, ?, ?, ?)',
            [title, category, priority, content]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/strategy/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category, priority, content } = req.body;
    try {
        await pool.query(
            'UPDATE strategic_plans SET title = ?, category = ?, priority = ?, content = ? WHERE id = ?',
            [title, category, priority, content, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/strategy/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM strategic_plans WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Library Endpoints ---
app.get('/api/library', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM library_items ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/library', async (req, res) => {
    const { title, author, type, status, rating, coverImage } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO library_items (title, author, type, status, rating, coverImage) VALUES (?, ?, ?, ?, ?, ?)',
            [title, author, type, status, rating, coverImage]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/library/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, type, status, rating, coverImage } = req.body;
    try {
        await pool.query(
            'UPDATE library_items SET title = ?, author = ?, type = ?, status = ?, rating = ?, coverImage = ? WHERE id = ?',
            [title, author, type, status, rating, coverImage, id]
        );
        res.json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/library/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM library_items WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Document Endpoints ---

app.get('/api/documents', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM documents ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/documents', async (req, res) => {
    const { title, category, fileSize, fileType, fileUrl } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO documents (title, category, fileSize, fileType, fileUrl) VALUES (?, ?, ?, ?, ?)',
            [title, category, fileSize, fileType, fileUrl]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/documents/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM documents WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Bin Endpoints ---

app.get('/api/bin', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bin ORDER BY deletedAt DESC');
        const binItems = rows.map(row => ({
            ...row,
            data: JSON.parse(row.data)
        }));
        res.json(binItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/bin', async (req, res) => {
    const { source, data } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO bin (source, data) VALUES (?, ?)',
            [source, JSON.stringify(data)]
        );
        res.status(201).json({ id: result.insertId, source, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/bin/empty', async (req, res) => {
    try {
        await pool.query('DELETE FROM bin');
        res.json({ message: 'Bin emptied successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/bin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM bin WHERE id = ?', [id]);
        res.json({ message: 'Permanently deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/bin/restore/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM bin WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });

        const item = rows[0];
        const source = item.source;
        const data = JSON.parse(item.data);

        // Restore based on source
        if (source === 'diary') {
            await pool.query(
                'INSERT INTO diary_entries (title, content, day, weekday, tags, coverImage) VALUES (?, ?, ?, ?, ?, ?)',
                [data.title, JSON.stringify(data.content), data.day, data.weekday, JSON.stringify(data.tags), data.coverImage]
            );
        } else if (source === 'plans') {
            await pool.query(
                'INSERT INTO planner_tasks (title, category, time, date, completed) VALUES (?, ?, ?, ?, ?)',
                [data.title, data.category, data.time, data.date, data.completed ? 1 : 0]
            );
        } else if (source === 'documents') {
            await pool.query(
                'INSERT INTO documents (title, category, fileSize, fileType, fileUrl) VALUES (?, ?, ?, ?, ?)',
                [data.title, data.category, data.fileSize, data.fileType, data.fileUrl]
            );
        } else if (source === 'experimental') {
            await pool.query(
                'INSERT INTO experiments (title, status, tags, notes) VALUES (?, ?, ?, ?)',
                [data.title, data.status, JSON.stringify(data.tags), typeof data.notes === 'object' ? JSON.stringify(data.notes) : data.notes]
            );
        } else if (source === 'movies') {
            await pool.query(
                'INSERT INTO movies (title, rating, genre, status, watched, coverImage) VALUES (?, ?, ?, ?, ?, ?)',
                [data.title, data.rating, data.genre, data.status, data.watched, data.coverImage]
            );
        } else if (source === 'recipes') {
            await pool.query(
                'INSERT INTO recipes (title, prepTime, cookTime, difficulty, tags, coverImage) VALUES (?, ?, ?, ?, ?, ?)',
                [data.title, data.prepTime, data.cookTime, data.difficulty, JSON.stringify(data.tags), data.coverImage]
            );
        } else if (source === 'courses') {
            await pool.query(
                'INSERT INTO courses (title, platform, status, progress, link) VALUES (?, ?, ?, ?, ?)',
                [data.title, data.platform, data.status, data.progress, data.link]
            );
        } else if (source === 'travel') {
            await pool.query(
                'INSERT INTO travel_plans (destination, dates, status, budget, activities) VALUES (?, ?, ?, ?, ?)',
                [data.destination, data.dates, data.status, data.budget, JSON.stringify(data.activities)]
            );
        } else if (source === 'strategy') {
            await pool.query(
                'INSERT INTO strategic_plans (title, category, priority, content) VALUES (?, ?, ?, ?)',
                [data.title, data.category, data.priority, data.content]
            );
        } else if (source === 'library') {
            await pool.query(
                'INSERT INTO library_items (title, author, type, status, rating, coverImage) VALUES (?, ?, ?, ?, ?, ?)',
                [data.title, data.author, data.type, data.status, data.rating, data.coverImage]
            );
        }
        // Add more as needed

        await pool.query('DELETE FROM bin WHERE id = ?', [id]);
        res.json({ message: 'Item restored' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Hero Image Endpoints ---
app.get('/api/hero-images/:pageKey', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT image_data FROM hero_images WHERE page_key = ?', [req.params.pageKey]);
        if (rows.length > 0) {
            res.json({ image: rows[0].image_data });
        } else {
            res.json({ image: null });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/hero-images', async (req, res) => {
    const { pageKey, imageData } = req.body;
    try {
        await pool.query(
            'INSERT INTO hero_images (page_key, image_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_data = ?',
            [pageKey, imageData, imageData]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/hero-images/:pageKey', async (req, res) => {
    try {
        await pool.query('DELETE FROM hero_images WHERE page_key = ?', [req.params.pageKey]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
