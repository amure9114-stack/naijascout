import express from 'express';
import {
    getPlayerPerformance,
    getPerformanceMetrics
} from '../controllers/analytics.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Get player performance overview
router.get('/player/:playerId', authenticate, getPlayerPerformance);

// Get performance metrics (filtered)
router.get('/player/:playerId/metrics', authenticate, getPerformanceMetrics);

export default router;




