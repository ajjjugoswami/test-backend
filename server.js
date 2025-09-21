require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
const DATABASE_URL = process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL;

// PostgreSQL connection (only if DATABASE_URL is provided)
let pool;
let useDatabase = false;

if (DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Test the connection
    pool.on('connect', () => {
      console.log('Database connected successfully');
      useDatabase = true;
    });

    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
      useDatabase = false;
    });
  } catch (error) {
    console.error('Failed to create database connection:', error);
    useDatabase = false;
  }
} else {
  console.log('No DATABASE_URL provided, using in-memory storage');
}

// In-memory user storage (fallback for development)
const users = [];

// Initialize database table
async function initializeDatabase() {
  if (!pool) {
    console.log('No database pool available');
    return;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
    useDatabase = true;
  } catch (error) {
    console.error('Database initialization error:', error);
    // Try a simple query to see if database is accessible
    try {
      await pool.query('SELECT 1');
      console.log('Database connection works, but table creation failed. Assuming table exists.');
      useDatabase = true;
    } catch (simpleError) {
      console.error('Database connection also failed:', simpleError);
      useDatabase = false; // Fall back to in-memory storage
    }
  }
}

// Wait for database connection and initialize
async function setupDatabase() {
  if (pool) {
    // Wait a bit for connection to establish
    await new Promise(resolve => setTimeout(resolve, 1000));
    await initializeDatabase();
  }
}

// Initialize database on startup
setupDatabase();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    let databaseStatus = 'In-memory storage';

    if (useDatabase && pool) {
      // Test database connection
      await pool.query('SELECT 1');
      databaseStatus = 'Connected';
    }

    res.json({
      status: 'OK',
      database: databaseStatus,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      environment: process.env.NODE_ENV || 'development',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Sign-in endpoint
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user;

    if (useDatabase && pool) {
      // Use database
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      user = result.rows[0];
    } else {
      // Use in-memory storage
      user = users.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Sign in successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Sign-up endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let existingUser;

    if (useDatabase && pool) {
      // Check if user already exists in database
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      existingUser = result.rows[0];
    } else {
      // Check if user already exists in memory
      existingUser = users.find(u => u.email === email);
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (useDatabase && pool) {
      // Create user in database
      const result = await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
      );
      newUser = result.rows[0];
    } else {
      // Create user in memory
      newUser = {
        id: users.length + 1,
        email,
        password: hashedPassword
      };
      users.push(newUser);
    }

    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.error('Sign-up error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});