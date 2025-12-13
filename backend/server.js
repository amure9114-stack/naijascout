import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import playerRoutes from './routes/players.js';
import authRoutes from './routes/auth.js';
import scoutsRoutes from './routes/scouts.js';
import trialsRoutes from './routes/trials.js';
import messagesRoutes from './routes/messages.js';
import notificationsRoutes from './routes/notifications.js';
import postsRoutes from './routes/posts.js';
import analyticsRoutes from './routes/analytics.js';
import fansRoutes from './routes/fans.js';
import adminRoutes from './routes/admin.js';
import uploadsRoutes from './routes/uploads.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

// Load environment variables
dotenv.config();

// Safety: disallow enabling dev tools in production
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEV_TOOLS === 'true') {
  console.error('Refusing to start: ALLOW_DEV_TOOLS is true in production. Unset ALLOW_DEV_TOOLS to continue.');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/auth', authRoutes);
// Also mount auth routes at the plain `/api` path so legacy clients
// calling `/api/register` or `/api/login` work without changing the frontend.
app.use('/api', authRoutes);
app.use('/api/scouts', scoutsRoutes);
app.use('/api/trials', trialsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/fans', fansRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadsRoutes);

// Swagger API docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Quiet favicon requests to the API host
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NaijaScout API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to NaijaScout API',
    version: '1.0.0',
    endpoints: {
      players: '/api/players',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
