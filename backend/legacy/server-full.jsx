// Full legacy server (moved to backend/legacy). Kept for reference only.
// Do not run this file directly; the application uses `start.js` + `server.js` (app) now.

/* Original legacy server contents (CommonJS) moved here. */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose'); // Assuming MongoDB integration

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use(require('helmet')()); // Security
app.use(require('rate-limit')({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting

// MongoDB Connection (update with your URI)
mongoose.connect('mongodb://localhost:27017/naijascout', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ... (remaining content omitted for brevity)

module.exports = app;
