import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// GET /api/messages/conversations
router.get('/conversations', authenticate, async (req, res) => {
    try {
        // Get unique conversations (both sent and received)
        const sent = await prisma.message.findMany({
            where: { senderId: req.user.id },
            distinct: ['receiverId'],
            select: { receiverId: true },
            orderBy: { createdAt: 'desc' }
        });
        
        const received = await prisma.message.findMany({
            where: { receiverId: req.user.id },
            distinct: ['senderId'],
            select: { senderId: true },
            orderBy: { createdAt: 'desc' }
        });
        
        const conversationIds = new Set([
            ...sent.map(m => m.receiverId),
            ...received.map(m => m.senderId)
        ]);
        
        res.json({ success: true, data: Array.from(conversationIds) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/messages/:userId
router.post('/:userId', [
    param('userId').isString().notEmpty(),
    body('text').isString().notEmpty()
], handleValidation, authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        
        const message = await prisma.message.create({
            data: {
                senderId: req.user.id,
                receiverId: req.params.userId,
                text
            }
        });
        
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/messages/:userId
router.get('/:userId', [
    param('userId').isString().notEmpty()
], handleValidation, authenticate, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: req.user.id, receiverId: req.params.userId },
                    { senderId: req.params.userId, receiverId: req.user.id }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });
        
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;

export default router;
