import express from 'express';
import {
    getInjuries,
    getInjuryById,
    createInjury,
    updateInjury,
    deleteInjury,
    getPlayerInjuries
} from '../controllers/injury.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Get all injuries (with optional playerId filter)
router.get('/', getInjuries);

// Get injuries for a specific player
router.get('/player/:playerId', getPlayerInjuries);

// Get single injury
router.get('/:id', getInjuryById);

// Create injury (authenticated)
router.post('/', authenticate, createInjury);

// Update injury (authenticated)
router.put('/:id', authenticate, updateInjury);
router.patch('/:id', authenticate, updateInjury);

// Delete injury (authenticated)
router.delete('/:id', authenticate, deleteInjury);

export default router;




