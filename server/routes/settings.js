const express = require('express');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = {};
  rows.forEach((r) => { settings[r.key] = r.value; });
  res.json(settings);
});

router.put('/', authenticate, (req, res) => {
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const allowed = ['n8n_webhook_url', 'make_webhook_url'];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      upsert.run(key, req.body[key]);
    }
  }

  res.json({ success: true });
});

module.exports = router;
