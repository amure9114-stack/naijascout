import express from 'express';
import {
    getSponsorships,
    getSponsorshipById,
    createSponsorship,
    applyForSponsorship,
    getPlayerApplications,
    updateApplicationStatus
} from '../controllers/sponsorship.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Get all sponsorships
router.get('/', getSponsorships);

// Get single sponsorship
router.get('/:id', getSponsorshipById);

// Create sponsorship (admin/scout only - add authorization later)
router.post('/', authenticate, createSponsorship);

// Apply for sponsorship (authenticated)
router.post('/:sponsorshipId/apply', authenticate, applyForSponsorship);

// Get player's applications
router.get('/player/:playerId/applications', authenticate, getPlayerApplications);

// Update application status (admin/scout only)
router.put('/applications/:id/status', authenticate, updateApplicationStatus);

export default router;


