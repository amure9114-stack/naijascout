import express from 'express';
import { param, validationResult } from 'express-validator';
import { authenticate, authorizeRole } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// GET /api/admin/users
router.get('/users', authenticate, authorizeRole(['Academy', 'Scout', 'Admin']), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/admin/user/:id
router.delete('/user/:id', [
    param('id').isString().notEmpty()
], handleValidation, authenticate, authorizeRole(['Academy', 'Scout', 'Admin']), async (req, res) => {
    try {
        // Prevent self-deletion
        if (req.params.id === req.user.id) {
            return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
        }
        
        const user = await prisma.user.delete({
            where: { id: req.params.id }
        });
        
        res.json({
            success: true,
            data: user,
            message: `User ${user.username} deleted successfully`
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/admin/analytics/overview
router.get('/analytics/overview', authenticate, authorizeRole(['Academy', 'Scout', 'Admin']), async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalPlayers = await prisma.player.count();
        const totalTrials = await prisma.trial.count();
        const totalShortlists = await prisma.shortlist.count();
        
        const recentUsers = await prisma.user.findMany({
            select: { id: true, username: true, role: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        
        res.json({
            success: true,
            data: {
                totalUsers,
                totalPlayers,
                totalTrials,
                totalShortlists,
                recentUsers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
