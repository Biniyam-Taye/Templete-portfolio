const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL server.');

    const dbName = process.env.DB_NAME || 'portfolio_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database "${dbName}" created or already exists.`);

    await connection.query(`USE \`${dbName}\``);

    // Create Diary table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS diary_entries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            content LONGTEXT NOT NULL,
            day VARCHAR(50),
            weekday VARCHAR(50),
            tags TEXT,
            coverImage LONGTEXT,
            userId VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Table "diary_entries" created or already exists.');

    // Create Plans table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS planner_tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(50),
            time VARCHAR(100),
            date DATE,
            completed BOOLEAN DEFAULT FALSE,
            userId VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Table "planner_tasks" created or already exists.');

    // Create Planner Categories table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS planner_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(100) UNIQUE,
            title VARCHAR(100) NOT NULL,
            subtitle VARCHAR(100),
            color VARCHAR(50),
            gradient TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Table "planner_categories" created or already exists.');

    // Seed default categories if empty
    const [catRows] = await connection.query('SELECT COUNT(*) as count FROM planner_categories');
    if (catRows[0].count === 0) {
        const defaultCategories = [
            ['brain-dump', 'Brain Dump', 'Quick ideas', '#be185d', 'linear-gradient(135deg, #be185d, #db2777)'],
            ['intention', "Today's Intention", 'Focus', '#10b981', 'linear-gradient(135deg, #059669, #10b981)'],
            ['weekly', 'Weekly Goals', 'Priorities', '#b91c1c', 'linear-gradient(135deg, #b91c1c, #dc2626)'],
            ['morning', '6am Rise + Shine', 'Morning Routine', '#d97706', 'linear-gradient(135deg, #d97706, #f59e0b)'],
            ['workout', '6:15am Workout', 'Health', '#a16207', 'linear-gradient(135deg, #a16207, #ca8a04)'],
            ['relax', '9pm Relax + Unwind', 'Rest', '#431407', 'linear-gradient(135deg, #431407, #78350f)'],
            ['content', 'Content Plan', 'Creation', '#3f6212', 'linear-gradient(135deg, #3f6212, #65a30d)'],
            ['money', 'Finance', 'Budget', '#15803d', 'linear-gradient(135deg, #15803d, #16a34a)']
        ];
        for (const cat of defaultCategories) {
            await connection.query('INSERT INTO planner_categories (slug, title, subtitle, color, gradient) VALUES (?, ?, ?, ?, ?)', cat);
        }
        console.log('Default planner categories seeded.');
    }

    // Create Documents table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS documents (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            fileSize VARCHAR(50),
            fileType VARCHAR(100),
            fileUrl LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Table "documents" created or already exists.');

    // Create experiments table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS experiments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            status VARCHAR(100),
            tags JSON,
            notes LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create movies table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS movies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            rating VARCHAR(50),
            genre VARCHAR(100),
            status VARCHAR(100),
            watched VARCHAR(100),
            coverImage LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create recipes table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            prepTime VARCHAR(100),
            cookTime VARCHAR(100),
            difficulty VARCHAR(100),
            tags JSON,
            coverImage LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create courses table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            platform VARCHAR(100),
            status VARCHAR(100),
            progress INT DEFAULT 0,
            link TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create travel_plans table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS travel_plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            destination VARCHAR(255) NOT NULL,
            dates VARCHAR(255),
            status VARCHAR(100),
            budget VARCHAR(100),
            activities JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create strategic_plans table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS strategic_plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            priority VARCHAR(100),
            content LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create library_items table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS library_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255),
            type VARCHAR(100),
            status VARCHAR(100),
            rating VARCHAR(50),
            coverImage LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create Bin table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS bin (
            id INT AUTO_INCREMENT PRIMARY KEY,
            source VARCHAR(100) NOT NULL,
            deletedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            data LONGTEXT NOT NULL
        )
    `);
    console.log('All module tables created or already exist.');

    // Create Settings table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS settings (
            \`key\` VARCHAR(100) PRIMARY KEY,
            \`value\` TEXT
        )
    `);
    console.log('Table "settings" created or already exists.');

    // Create Hero Images table
    await connection.query(`
        CREATE TABLE IF NOT EXISTS hero_images (
            page_key VARCHAR(50) PRIMARY KEY,
            image_data LONGTEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    console.log('Table "hero_images" created or already exists.');

    await connection.end();
    console.log('Database setup complete.');
}

setupDatabase().catch(err => {
    console.error('Error setting up database:', err);
    process.exit(1);
});
