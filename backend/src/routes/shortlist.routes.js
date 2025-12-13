import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getShortlists, addToShortlist, removeFromShortlist } from '../controllers/shortlist.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getShortlists);
router.post('/', authMiddleware, addToShortlist);
router.delete('/:id', authMiddleware, removeFromShortlist);

export default router;
