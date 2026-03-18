const express = require('express');
const db = require('../database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticate, (req, res) => {
  const totalCases = db.prepare("SELECT COUNT(*) as count FROM cases").get().count;
  const openCases = db.prepare("SELECT COUNT(*) as count FROM cases WHERE status = 'Open'").get().count;
  const pendingCases = db.prepare("SELECT COUNT(*) as count FROM cases WHERE status = 'Pending'").get().count;
  const closedCases = db.prepare("SELECT COUNT(*) as count FROM cases WHERE status = 'Closed'").get().count;
  const archivedCases = db.prepare("SELECT COUNT(*) as count FROM cases WHERE status = 'Archived'").get().count;
  const totalAmount = db.prepare("SELECT COALESCE(SUM(amountRecovered),0) as total FROM cases WHERE status != 'Archived'").get().total;

  const bySection = db.prepare(`
    SELECT section, COUNT(*) as count FROM cases WHERE status != 'Archived' GROUP BY section ORDER BY count DESC
  `).all();

  // Monthly case counts for the last 12 months
  const monthly = db.prepare(`
    SELECT strftime('%Y-%m', createdAt) as month, COUNT(*) as count
    FROM cases
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `).all().reverse();

  res.json({
    totalCases,
    openCases,
    pendingCases,
    closedCases,
    archivedCases,
    totalAmount,
    bySection,
    monthly,
  });
});

module.exports = router;
