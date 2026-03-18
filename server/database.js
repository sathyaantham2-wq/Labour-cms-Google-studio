const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, 'labour_cms.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

// Ensure uploads directory exists
const uploadsDir = path.join(dataDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

db.exec(`
  CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    fileNumber TEXT NOT NULL UNIQUE,
    receivedDate TEXT NOT NULL,
    section TEXT NOT NULL DEFAULT '',
    applicantName TEXT NOT NULL DEFAULT '',
    applicantPhones TEXT NOT NULL DEFAULT '[]',
    applicantEmail TEXT DEFAULT '',
    applicantAddress TEXT DEFAULT '',
    managementName TEXT NOT NULL DEFAULT '',
    managementPerson TEXT DEFAULT '',
    managementPhone TEXT DEFAULT '',
    managementEmail TEXT DEFAULT '',
    managementAddress TEXT DEFAULT '',
    subject TEXT NOT NULL DEFAULT '',
    amountRecovered REAL DEFAULT 0,
    status TEXT DEFAULT 'Open',
    hearings TEXT NOT NULL DEFAULT '[]',
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'officer',
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY,
    caseId TEXT NOT NULL,
    filename TEXT NOT NULL,
    originalName TEXT NOT NULL,
    mimeType TEXT NOT NULL,
    size INTEGER NOT NULL,
    uploadedBy TEXT NOT NULL,
    uploadedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    action TEXT NOT NULL,
    entityType TEXT NOT NULL,
    entityId TEXT NOT NULL,
    userId INTEGER,
    username TEXT,
    diff TEXT
  );

  CREATE TABLE IF NOT EXISTS revoked_tokens (
    token TEXT PRIMARY KEY,
    revokedAt TEXT NOT NULL
  );
`);

// Seed default admin user
const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!existingAdmin) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  db.prepare(
    'INSERT INTO users (username, password, role, createdAt) VALUES (?, ?, ?, ?)'
  ).run('admin', hashedPassword, 'admin', new Date().toISOString());
  console.log(`✓ Default admin created  →  username: admin  |  password: ${adminPassword}`);
}

// Seed demo case
const caseCount = db.prepare('SELECT COUNT(*) as count FROM cases').get();
if (caseCount.count === 0) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO cases (id, fileNumber, receivedDate, section, applicantName, applicantPhones,
      applicantEmail, applicantAddress, managementName, managementPerson, managementPhone,
      managementEmail, managementAddress, subject, amountRecovered, status, hearings, createdAt)
    VALUES (@id, @fileNumber, @receivedDate, @section, @applicantName, @applicantPhones,
      @applicantEmail, @applicantAddress, @managementName, @managementPerson, @managementPhone,
      @managementEmail, @managementAddress, @subject, @amountRecovered, @status, @hearings, @createdAt)
  `).run({
    id: 'demo-1',
    fileNumber: 'TG/LC/2025/001',
    receivedDate: '2025-01-15',
    section: 'Minimum Wages',
    applicantName: 'Rajesh Kumar Yadav',
    applicantPhones: JSON.stringify(['9876543210']),
    applicantEmail: 'rajesh.yadav@example.com',
    applicantAddress: 'Plot 45, Jubilee Hills, Hyderabad',
    managementName: 'Sunrise Textiles Pvt Ltd',
    managementPerson: 'Sri K. Venkatesh',
    managementPhone: '8887776660',
    managementEmail: 'hr@sunrisetextiles.com',
    managementAddress: 'HITEC City, Phase 2, Hyderabad',
    subject: 'Unpaid Wages – 6 Months Arrears',
    amountRecovered: 148000,
    status: 'Open',
    hearings: JSON.stringify([
      { id: 'h1', date: '2025-02-10T10:30', remarks: 'Case registered. Notice issued to Management.', isCompleted: true }
    ]),
    createdAt: now
  });
  console.log('✓ Demo case seeded: TG/LC/2025/001');
}

module.exports = db;
