// server.js
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({
      accessToken: 'fake-access-token-' + Date.now(),
      refreshToken: 'fake-refresh-token-' + Date.now(),
    });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken && refreshToken.startsWith('fake-refresh-token-')) {
    return res.json({
      accessToken: 'fake-access-token-' + Date.now(),
    });
  }
  return res.status(401).json({ message: 'Refresh token expired' });
});

app.post('/auth/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out' });
});

// Serve db.json data for /races
app.get('/races', (req, res) => {
  const db = JSON.parse(readFileSync('./db.json', 'utf-8'));
  return res.json(db.races);
});

app.listen(3000, () => {
  console.log('API server running on port 3000');
});
