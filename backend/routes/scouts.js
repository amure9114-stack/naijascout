import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticate, authorizeRole } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
};

// GET /api/scouts/players - discovery search
router.get('/players', [
    query('position').optional().isString(),
    query('ageMin').optional().isInt(),
    query('ageMax').optional().isInt()
], handleValidation, authenticate, authorizeRole(['Scout', 'Admin']), async (req, res) => {
    try {
        const { position, ageMin, ageMax } = req.query;
        
        const where = {};
        if (position) where.position = position;
        if (ageMin || ageMax) {
            where.age = {};
            if (ageMin) where.age.gte = parseInt(ageMin);
            if (ageMax) where.age.lte = parseInt(ageMax);
        }
        
        const players = await prisma.player.findMany({
            where,
            orderBy: { overallRating: 'desc' },
            take: 50
        });
        
        res.json({ success: true, data: players });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/scouts/report - create scouting report
router.post('/report', [
    body('playerId').isInt(),
    body('summary').isString().notEmpty(),
    body('rating').optional().isFloat({ min: 0, max: 10 }),
    body('notes').optional().isString()
], handleValidation, authenticate, authorizeRole(['Scout', 'Admin']), async (req, res) => {
    try {
        const { playerId, summary, rating, notes } = req.body;
        
        // Get scout info from authenticated user
        const scout = await prisma.scout.findUnique({ where: { email: req.user.email } });
        if (!scout) {
            return res.status(404).json({ success: false, error: 'Scout not found' });
        }
        
        const report = await prisma.scoutingReport.create({
            data: {
                scoutId: scout.id,
                playerId: parseInt(playerId),
                summary,
                rating: rating ? parseFloat(rating) : null,
                notes: notes || null
            }
        });
        
        res.status(201).json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/scouts/reports/:playerId
router.get('/reports/:playerId', [param('playerId').isInt()], handleValidation, authenticate, authorizeRole(['Scout', 'Admin']), async (req, res) => {
    try {
        const reports = await prisma.scoutingReport.findMany({
            where: { playerId: parseInt(req.params.playerId) },
            include: { scout: { select: { name: true, club: true } } },
            orderBy: { createdAt: 'desc' }
        });
        
        res.json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/scouts/shortlist/:playerId
router.post('/shortlist/:playerId', [
    param('playerId').isString().notEmpty(),
    body('notes').optional().isString()
], handleValidation, authenticate, authorizeRole(['Scout', 'Admin']), async (req, res) => {
    try {
        const { notes } = req.body;
        
        // Get scout info from authenticated user
        const scout = await prisma.scout.findUnique({ where: { email: req.user.email } });
        if (!scout) {
            return res.status(404).json({ success: false, error: 'Scout not found' });
        }
        
        // Check if already shortlisted
        const existing = await prisma.shortlist.findUnique({
            where: { scoutId_playerId: { scoutId: scout.id, playerId: req.params.playerId } }
        });
        
        if (existing) {
            // Remove from shortlist
            await prisma.shortlist.delete({
                where: { scoutId_playerId: { scoutId: scout.id, playerId: req.params.playerId } }
            });
            return res.json({ success: true, message: 'Player removed from shortlist' });
        }
        
        // Add to shortlist
        const shortlist = await prisma.shortlist.create({
            data: {
                scoutId: scout.id,
                playerId: req.params.playerId,
                notes: notes || null
            }
        });
        
        res.status(201).json({ success: true, data: shortlist, message: 'Player added to shortlist' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/scouts/shortlist
router.get('/shortlist', authenticate, authorizeRole(['Scout', 'Admin']), async (req, res) => {
    try {
        // Get scout info from authenticated user
        const scout = await prisma.scout.findUnique({ where: { email: req.user.email } });
        if (!scout) {
            return res.status(404).json({ success: false, error: 'Scout not found' });
        }
        
        const shortlist = await prisma.shortlist.findMany({
            where: { scoutId: scout.id },
            orderBy: { createdAt: 'desc' }
        });
        
        res.json({ success: true, data: shortlist });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/scouts/trials/applications
router.get('/trials/applications', authenticate, authorizeRole(['Scout', 'Admin']), async (req, res) => {
    try {
        // Get all trial applications
        const applications = await prisma.trialApplication.findMany({
            include: {
                trial: true,
                player: { select: { id: true, username: true, firstName: true, lastName: true, position: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
