// Legacy server copy moved to backend/legacy to avoid accidental execution
// Original legacy CommonJS server retained here for reference.
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

// ... (omitted) this file is kept for reference only

module.exports = app;
