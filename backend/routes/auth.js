import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const roleNormalized = (role || 'player').toString().toLowerCase();
    const allowedRoles = ['player', 'scout', 'academy', 'fan', 'admin'];
    if (!allowedRoles.includes(roleNormalized)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const emailNormalized = email.toLowerCase();
    const usernameNormalized = username.toLowerCase();

    const existing = await User.findOne({ $or: [{ email: emailNormalized }, { username: usernameNormalized }] });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, username: usernameNormalized, email: emailNormalized, passwordHash, role: roleNormalized });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      message: 'Registration failed',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    // Normalize lookup key
    const lookup = username.toLowerCase();
    // If Mongoose isn't connected and we're in development or dev tools allowed, allow a guarded dev fallback
    if ((process.env.NODE_ENV === 'development' || process.env.ALLOW_DEV_TOOLS === 'true') && mongoose.connection.readyState !== 1) {
      console.warn('[auth] MongoDB not connected — using development fallback for login');
      const devUser = (process.env.ADMIN_USERNAME && lookup === process.env.ADMIN_USERNAME.toLowerCase()) ||
        (process.env.ADMIN_EMAIL && lookup === process.env.ADMIN_EMAIL.toLowerCase());
      const devPasswordOk = password === (process.env.ADMIN_PASSWORD || 'ChangeMeNow!');
      if (devUser && devPasswordOk) {
        const fakeUser = { _id: 'dev-admin', name: process.env.ADMIN_NAME || 'Developer Admin', username: process.env.ADMIN_USERNAME || 'admin', email: process.env.ADMIN_EMAIL || 'admin@naijascout.local', role: (process.env.ADMIN_ROLE || 'admin').toLowerCase() };
        const token = jwt.sign({ sub: fakeUser._id, role: fakeUser.role, username: fakeUser.username }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
        return res.json({ token, user: fakeUser });
      }
      return res.status(401).json({ message: 'Invalid credentials (dev fallback)' });
    }

    const user = await User.findOne({ $or: [{ username: lookup }, { email: lookup }] });
    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[auth] Login attempt for unknown user: ${lookup}`);
        return res.status(401).json({ message: 'Invalid credentials', reason: 'user-not-found' });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[auth] Invalid password attempt for user: ${lookup}`);
        return res.status(401).json({ message: 'Invalid credentials', reason: 'invalid-password' });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ message: 'Role mismatch' });
    }

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      message: 'Login failed',
      ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
  }
});

export default router;

// GET /api/me — return current token payload or user record
router.get('/me', (req, res) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    // In development, if Mongo isn't connected, return payload directly
    if ((process.env.NODE_ENV === 'development' || process.env.ALLOW_DEV_TOOLS === 'true') && mongoose.connection.readyState !== 1) {
      return res.json({ user: { id: payload.sub, username: payload.username || 'dev', role: payload.role || 'Scout' }, payload });
    }
    // Otherwise try to resolve user from DB
    User.findById(payload.sub).then(user => {
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ user: { id: user._id, username: user.username, email: user.email, name: user.name, role: user.role } });
    }).catch(err => {
      console.error('GET /me DB error:', err);
      return res.status(500).json({ message: 'Failed to fetch user' });
    });
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});


