const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all users (admin only)
router.get('/', authenticate, requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, username, role, createdAt FROM users ORDER BY createdAt ASC').all();
  res.json(users);
});

// POST create user (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  const validRoles = ['admin', 'officer', 'viewer'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: `role must be one of: ${validRoles.join(', ')}` });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (username, password, role, createdAt) VALUES (?, ?, ?, ?)'
  ).run(username, hashed, role || 'officer', new Date().toISOString());

  res.status(201).json({ id: result.lastInsertRowid, username, role: role || 'officer' });
});

// PUT update user role/username (admin only)
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { username, role } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const validRoles = ['admin', 'officer', 'viewer'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: `role must be one of: ${validRoles.join(', ')}` });
  }

  if (username && username !== user.username) {
    const conflict = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, user.id);
    if (conflict) return res.status(409).json({ error: 'Username already taken' });
  }

  db.prepare('UPDATE users SET username = ?, role = ? WHERE id = ?').run(
    username || user.username,
    role || user.role,
    user.id
  );

  res.json({ id: user.id, username: username || user.username, role: role || user.role });
});

// PUT change password (admin or the user themselves)
router.put('/:id/password', authenticate, (req, res) => {
  const targetId = parseInt(req.params.id, 10);
  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Non-admins must supply current password
  if (req.user.role !== 'admin') {
    if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, targetId);
  res.json({ success: true });
});

// DELETE user (admin only, cannot delete self)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const targetId = parseInt(req.params.id, 10);
  if (req.user.id === targetId) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  const result = db.prepare('DELETE FROM users WHERE id = ?').run(targetId);
  if (result.changes === 0) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

module.exports = router;
