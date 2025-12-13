import express from 'express';
import { createMatch, getMatchesByPlayer, getCurrentPlayerMatches } from '../controllers/match.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Get current player's matches (authenticated)
router.get('/me', authenticate, getCurrentPlayerMatches);

// Get matches by player ID
router.get('/player/:playerId', getMatchesByPlayer);

// Create match (authenticated)
router.post('/', authenticate, createMatch);

export default router;
