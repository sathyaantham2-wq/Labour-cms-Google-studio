const express = require('express');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const parseCase = (row) => ({
  ...row,
  applicantPhones: JSON.parse(row.applicantPhones || '[]'),
  hearings: JSON.parse(row.hearings || '[]'),
  amountRecovered: Number(row.amountRecovered || 0),
});

// Public: search by file number (no auth required)
router.get('/public/:fileNumber', (req, res) => {
  const row = db
    .prepare("SELECT * FROM cases WHERE fileNumber = ? AND status != 'Archived'")
    .get(req.params.fileNumber);

  if (!row) return res.status(404).json({ error: 'Case not found' });

  const c = parseCase(row);
  res.json({
    id: c.id,
    fileNumber: c.fileNumber,
    status: c.status,
    section: c.section,
    applicantName: c.applicantName,
    managementName: c.managementName,
    subject: c.subject,
    hearings: c.hearings,
    createdAt: c.createdAt,
  });
});

// GET all cases
router.get('/', authenticate, (req, res) => {
  const rows = db.prepare('SELECT * FROM cases ORDER BY createdAt DESC').all();
  res.json(rows.map(parseCase));
});

// GET single case
router.get('/:id', authenticate, (req, res) => {
  const row = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Case not found' });
  res.json(parseCase(row));
});

// POST create case
router.post('/', authenticate, (req, res) => {
  const c = req.body;

  if (!c.id || !c.fileNumber) {
    return res.status(400).json({ error: 'id and fileNumber are required' });
  }

  const existing = db.prepare('SELECT id FROM cases WHERE fileNumber = ?').get(c.fileNumber);
  if (existing) {
    return res.status(409).json({ error: `File number '${c.fileNumber}' already exists` });
  }

  db.prepare(`
    INSERT INTO cases (id, fileNumber, receivedDate, section, applicantName, applicantPhones,
      applicantEmail, applicantAddress, managementName, managementPerson, managementPhone,
      managementEmail, managementAddress, subject, amountRecovered, status, hearings, createdAt)
    VALUES (@id, @fileNumber, @receivedDate, @section, @applicantName, @applicantPhones,
      @applicantEmail, @applicantAddress, @managementName, @managementPerson, @managementPhone,
      @managementEmail, @managementAddress, @subject, @amountRecovered, @status, @hearings, @createdAt)
  `).run({
    ...c,
    applicantPhones: JSON.stringify(c.applicantPhones || []),
    hearings: JSON.stringify(c.hearings || []),
    amountRecovered: Number(c.amountRecovered || 0),
    createdAt: c.createdAt || new Date().toISOString(),
  });

  res.status(201).json(c);
});

// PUT update case
router.put('/:id', authenticate, (req, res) => {
  const c = { ...req.body, id: req.params.id };

  const result = db.prepare(`
    UPDATE cases SET
      fileNumber=@fileNumber, receivedDate=@receivedDate, section=@section,
      applicantName=@applicantName, applicantPhones=@applicantPhones,
      applicantEmail=@applicantEmail, applicantAddress=@applicantAddress,
      managementName=@managementName, managementPerson=@managementPerson,
      managementPhone=@managementPhone, managementEmail=@managementEmail,
      managementAddress=@managementAddress, subject=@subject,
      amountRecovered=@amountRecovered, status=@status, hearings=@hearings
    WHERE id=@id
  `).run({
    ...c,
    applicantPhones: JSON.stringify(c.applicantPhones || []),
    hearings: JSON.stringify(c.hearings || []),
    amountRecovered: Number(c.amountRecovered || 0),
  });

  if (result.changes === 0) return res.status(404).json({ error: 'Case not found' });
  res.json(c);
});

module.exports = router;
