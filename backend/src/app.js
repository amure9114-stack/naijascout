import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from '../routes/auth.js';
import playerRoutes from './routes/player.routes.js';
import scoutRoutes from './routes/scout.routes.js';
import shortlistRoutes from './routes/shortlist.routes.js';
import matchRoutes from './routes/match.routes.js';
import trialsRoutes from './routes/trials.routes.js';
import injuryRoutes from './routes/injury.routes.js';
import sponsorshipRoutes from './routes/sponsorship.routes.js';
import tournamentRoutes from './routes/tournament.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        // Allow any localhost origin (different ports are fine)
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // if you're sending cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/scouts', scoutRoutes);
app.use('/api/shortlists', shortlistRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/trials', trialsRoutes);
app.use('/api/injuries', injuryRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'NaijaScout API is healthy' });
});

// 404
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
