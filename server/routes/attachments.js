const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '..', 'data', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.random().toString(36).slice(2);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|doc|docx|jpg|jpeg|png|txt|xlsx|xls/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

// POST upload attachment for a case
router.post('/:caseId', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const caseRow = db.prepare('SELECT id FROM cases WHERE id = ?').get(req.params.caseId);
  if (!caseRow) {
    fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: 'Case not found' });
  }

  const attachment = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    caseId: req.params.caseId,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedBy: req.user.username,
    uploadedAt: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO attachments (id, caseId, filename, originalName, mimeType, size, uploadedBy, uploadedAt)
    VALUES (@id, @caseId, @filename, @originalName, @mimeType, @size, @uploadedBy, @uploadedAt)
  `).run(attachment);

  res.status(201).json(attachment);
});

// GET list attachments for a case
router.get('/:caseId', authenticate, (req, res) => {
  const rows = db.prepare('SELECT * FROM attachments WHERE caseId = ? ORDER BY uploadedAt DESC').all(req.params.caseId);
  res.json(rows);
});

// GET download/serve a file
router.get('/file/:id', authenticate, (req, res) => {
  const row = db.prepare('SELECT * FROM attachments WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Attachment not found' });

  const filePath = path.join(UPLOADS_DIR, row.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });

  res.setHeader('Content-Disposition', `inline; filename="${row.originalName}"`);
  res.setHeader('Content-Type', row.mimeType);
  res.sendFile(filePath);
});

// DELETE an attachment (admin or uploader)
router.delete('/:id', authenticate, (req, res) => {
  const row = db.prepare('SELECT * FROM attachments WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Attachment not found' });

  if (req.user.role !== 'admin' && req.user.username !== row.uploadedBy) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const filePath = path.join(UPLOADS_DIR, row.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  db.prepare('DELETE FROM attachments WHERE id = ?').run(row.id);
  res.json({ success: true });
});

module.exports = router;
