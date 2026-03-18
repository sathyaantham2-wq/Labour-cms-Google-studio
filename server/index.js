require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const casesRoutes = require('./routes/cases');
const settingsRoutes = require('./routes/settings');

const PORT = process.env.PORT || 4000;
const app = express();

// CORS – allow Vite dev server (port 3000) and same-origin production
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ╔════════════════════════════════════════╗');
  console.log('  ║   Labour CMS  –  Backend Server        ║');
  console.log(`  ║   Running on  →  http://localhost:${PORT}  ║`);
  console.log('  ╚════════════════════════════════════════╝');
  console.log('');
});
