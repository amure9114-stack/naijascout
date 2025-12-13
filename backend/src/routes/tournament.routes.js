import express from 'express';
import {
    getTournaments,
    getTournamentById,
    createTournament,
    registerForTournament,
    getPlayerTournaments
} from '../controllers/tournament.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Get all tournaments
router.get('/', getTournaments);

// Get single tournament
router.get('/:id', getTournamentById);

// Create tournament (admin/scout only - add authorization later)
router.post('/', authenticate, createTournament);

// Register for tournament (authenticated)
router.post('/:tournamentId/register', authenticate, registerForTournament);

// Get player's tournaments
router.get('/player/:playerId', authenticate, getPlayerTournaments);

export default router;


