const path = require('path');
const express = require('express');
const fs = require('fs');
require('dotenv').config();
const mysql = require('mysql2/promise');
const { Pool: PgPool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve the site root (one level up from server/)
app.use(express.static(path.join(__dirname, '..')));

// Unified DB client support (Postgres preferred via DATABASE_URL, fallback to MySQL)
let dbClient = null; // either mysql pool or pg pool
let dbType = null; // 'pg' | 'mysql'

async function initDb() {
  // Postgres via DATABASE_URL (recommended)
  if (process.env.DATABASE_URL) {
    try {
      dbClient = new PgPool({ connectionString: process.env.DATABASE_URL });
      dbType = 'pg';
      // Ensure contacts table exists (Postgres)
      const createSql = `
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          receivedAt TIMESTAMP WITH TIME ZONE NOT NULL
        );
      `;
      await dbClient.query(createSql);
      console.log('Postgres connected and contacts table ensured.');
      return;
    } catch (err) {
      console.error('Failed to initialize Postgres pool, will try MySQL fallback:', err.message);
      dbClient = null;
      dbType = null;
    }
  }

  // Fallback to MySQL if Postgres not configured
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.log('No SQL configuration found. Using file storage fallback.');
    return;
  }

  try {
    dbClient = await mysql.createPool({
      host: DB_HOST,
      port: DB_PORT ? Number(DB_PORT) : 3306,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    dbType = 'mysql';

    const createSql = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        receivedAt DATETIME NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await dbClient.query(createSql);
    console.log('MySQL connected and contacts table ensured.');
  } catch (err) {
    console.error('Failed to initialize MySQL pool, falling back to file storage:', err.message);
    dbClient = null;
    dbType = null;
  }
}

// Initialize DB (non-blocking startup)
initDb().catch(err => console.error('DB init error', err));

// Contact API: try DB insert, fallback to file storage
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  const receivedAt = new Date();

  // If DB client configured, attempt DB insert
  if (dbClient && dbType) {
    try {
      if (dbType === 'pg') {
        const sql = 'INSERT INTO contacts (name, email, message, receivedAt) VALUES ($1, $2, $3, $4)';
        await dbClient.query(sql, [name, email, message, receivedAt]);
      } else if (dbType === 'mysql') {
        await dbClient.execute(
          'INSERT INTO contacts (name, email, message, receivedAt) VALUES (?, ?, ?, ?)',
          [name, email, message, receivedAt]
        );
      }
      return res.json({ ok: true, stored: 'db' });
    } catch (err) {
      console.error('DB insert failed, will fallback to file:', err.message);
      // fallthrough to file fallback
    }
  }

  // Fallback: save to file (same behavior as before)
  const dataDir = path.join(__dirname, '..', 'data');
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  } catch (err) {
    console.error('Failed to create data directory', err);
  }

  const outFile = path.join(dataDir, 'contacts.json');
  const entry = { name, email, message, receivedAt: receivedAt.toISOString(), stored: 'file' };

  try {
    let list = [];
    if (fs.existsSync(outFile)) {
      const raw = fs.readFileSync(outFile, 'utf8');
      list = raw ? JSON.parse(raw) : [];
    }
    list.push(entry);
    fs.writeFileSync(outFile, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write contact entry', err);
    return res.status(500).json({ error: 'failed to save message' });
  }

  return res.json({ ok: true, stored: 'file' });
});

// Read contacts: try DB read, fallback to file
app.get('/api/contacts', async (req, res) => {
  // If DB client configured, query DB
  if (dbClient && dbType) {
    try {
      if (dbType === 'pg') {
        const result = await dbClient.query('SELECT id, name, email, message, receivedAt FROM contacts ORDER BY receivedAt DESC LIMIT 200');
        return res.json(result.rows || []);
      } else if (dbType === 'mysql') {
        const [rows] = await dbClient.query('SELECT id, name, email, message, receivedAt FROM contacts ORDER BY receivedAt DESC LIMIT 200');
        return res.json(rows || []);
      }
    } catch (err) {
      console.error('DB read failed, falling back to file:', err.message);
      // fallthrough to file fallback
    }
  }

  // File fallback
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    const outFile = path.join(dataDir, 'contacts.json');
    if (!fs.existsSync(outFile)) return res.json([]);
    const raw = fs.readFileSync(outFile, 'utf8');
    const list = raw ? JSON.parse(raw) : [];
    return res.json(list.reverse());
  } catch (err) {
    console.error('Failed to read contacts file', err);
    return res.status(500).json({ error: 'failed to read contacts' });
  }
});

// Fallback to index.html for SPA-style navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(port, () => {
  console.log(`Tea site server running at http://localhost:${port}`);
});
