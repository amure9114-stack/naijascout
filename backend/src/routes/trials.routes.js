import express from 'express';
import {
    getTrials,
    getTrialById,
    createTrial,
    updateTrial,
    deleteTrial,
    applyForTrial,
    getPlayerApplications
} from '../controllers/trials.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTrials);
router.get('/:id', getTrialById);

// Authenticated routes
router.post('/', authenticate, createTrial);
router.put('/:id', authenticate, updateTrial);
router.patch('/:id', authenticate, updateTrial);
router.delete('/:id', authenticate, deleteTrial);

// Trial applications
router.post('/:trialId/apply', authenticate, applyForTrial);
router.get('/player/:playerId/applications', authenticate, getPlayerApplications);

export default router;
