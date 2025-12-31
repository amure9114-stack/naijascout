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

// GET /api/fans/feed
router.get('/feed', authenticate, async (req, res) => {
    try {
        // Get list of users this person follows
        const follows = await prisma.follow.findMany({
            where: { followerId: req.user.id },
            select: { followeeId: true }
        });
        
        const followeeIds = follows.map(f => f.followeeId);
        
        res.json({ success: true, data: followeeIds });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/fans/follow/:userId
router.post('/follow/:userId', [
    param('userId').isString().notEmpty()
], handleValidation, authenticate, async (req, res) => {
    try {
        const followeeId = req.params.userId;
        
        // Prevent self-follow
        if (followeeId === req.user.id) {
            return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
        }
        
        // Check if already following
        const existing = await prisma.follow.findUnique({
            where: { followerId_followeeId: { followerId: req.user.id, followeeId } }
        });
        
        if (existing) {
            // Unfollow
            await prisma.follow.delete({
                where: { followerId_followeeId: { followerId: req.user.id, followeeId } }
            });
            return res.json({ success: true, message: 'Unfollowed user', following: false });
        }
        
        // Follow
        const follow = await prisma.follow.create({
            data: {
                followerId: req.user.id,
                followeeId
            }
        });
        
        res.status(201).json({ success: true, data: follow, message: 'Followed user', following: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/fans/followers
router.get('/followers/:userId', [
    param('userId').isString().notEmpty()
], handleValidation, async (req, res) => {
    try {
        const followers = await prisma.follow.findMany({
            where: { followeeId: req.params.userId },
            select: { followerId: true }
        });
        
        res.json({ success: true, data: followers.map(f => f.followerId) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
