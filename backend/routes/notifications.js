import express from 'express';
import { param, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// GET /api/notifications
router.get('/', authenticate, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/notifications/read/:id
router.post('/read/:id', [
    param('id').isString().notEmpty()
], handleValidation, authenticate, async (req, res) => {
    try {
        const notification = await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true }
        });
        
        res.json({ success: true, data: notification, message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/notifications/read-all
router.post('/read-all', authenticate, async (req, res) => {
    try {
        const result = await prisma.notification.updateMany({
            where: { userId: req.user.id, read: false },
            data: { read: true }
        });
        
        res.json({ success: true, data: result, message: `${result.count} notifications marked as read` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
