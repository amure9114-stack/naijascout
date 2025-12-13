import express from 'express';
import { 
    getPlayers, 
    getPlayerById, 
    getPlayerByUsername, 
    getCurrentPlayer,
    createPlayer, 
    updatePlayer, 
    updateCurrentPlayer,
    deletePlayer, 
    updatePlayerByUsername 
} from '../controllers/player.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPlayers);
router.get('/username/:username', getPlayerByUsername);
router.put('/username/:username', updatePlayerByUsername);
router.patch('/username/:username', updatePlayerByUsername);
router.post('/', createPlayer);

// Authenticated routes - must be before /:id route to avoid conflicts
router.get('/me', authenticate, getCurrentPlayer);
router.put('/me', authenticate, updateCurrentPlayer);
router.patch('/me', authenticate, updateCurrentPlayer);

// Routes with ID parameter (must come after /me)
router.get('/:id', getPlayerById);
router.put('/:id', updatePlayer);
router.patch('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

export default router;
