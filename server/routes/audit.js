const express = require('express');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET audit history for a specific case
router.get('/cases/:caseId', authenticate, (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM audit_log WHERE entityType = 'case' AND entityId = ?
    ORDER BY timestamp DESC LIMIT 100
  `).all(req.params.caseId);
  res.json(rows);
});

// GET recent audit log (admin only)
router.get('/recent', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  const rows = db.prepare('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 50').all();
  res.json(rows);
});

module.exports = router;
