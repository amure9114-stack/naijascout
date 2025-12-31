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

// POST /api/trials - create trial
router.post('/', [
    body('title').isString().notEmpty(),
    body('location').optional().isString(),
    body('date').optional().isISO8601(),
    body('ageGroup').optional().isString(),
    body('time').optional().isString(),
    body('description').optional().isString()
], handleValidation, authenticate, authorizeRole(['Admin']), async (req, res) => {
    try {
        const { title, location, date, ageGroup, time, description } = req.body;
        
        const trial = await prisma.trial.create({
            data: {
                title,
                location: location || '',
                date: new Date(date || Date.now()),
                ageGroup: ageGroup || null,
                time: time || null,
                description: description || null
            }
        });
        
        res.status(201).json({ success: true, data: trial });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/trials - public list
router.get('/', [
    query('location').optional().isString(),
    query('position').optional().isString(),
    query('ageGroup').optional().isString()
], async (req, res) => {
    try {
        const { location, ageGroup } = req.query;
        
        const where = {};
        if (location) where.location = { contains: location };
        if (ageGroup) where.ageGroup = ageGroup;
        
        const trials = await prisma.trial.findMany({
            where,
            orderBy: { date: 'asc' }
        });
        
        res.json({ success: true, data: trials });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/trials/:id
router.get('/:id', [param('id').isString().notEmpty()], handleValidation, async (req, res) => {
    try {
        const trial = await prisma.trial.findUnique({
            where: { id: req.params.id },
            include: { applications: { include: { player: { select: { id: true, username: true, firstName: true, lastName: true } } } } }
        });
        
        if (!trial) return res.status(404).json({ success: false, message: 'Trial not found' });
        res.json({ success: true, data: trial });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/trials/:id/apply
router.post('/:id/apply', [
    param('id').isString().notEmpty(),
    body('playerId').isString().notEmpty(),
    body('notes').optional().isString()
], handleValidation, authenticate, async (req, res) => {
    try {
        const { playerId, notes } = req.body;
        
        // Check if trial exists
        const trial = await prisma.trial.findUnique({ where: { id: req.params.id } });
        if (!trial) return res.status(404).json({ success: false, error: 'Trial not found' });
        
        // Check if already applied
        const existing = await prisma.trialApplication.findUnique({
            where: { trialId_playerId: { trialId: req.params.id, playerId } }
        });
        if (existing) return res.status(400).json({ success: false, error: 'Already applied to this trial' });
        
        const application = await prisma.trialApplication.create({
            data: {
                trialId: req.params.id,
                playerId,
                notes: notes || null
            }
        });
        
        res.status(201).json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/trials/:id/applications
router.get('/:id/applications', [
    param('id').isString().notEmpty(),
    query('status').optional().isIn(['pending', 'approved', 'rejected'])
], handleValidation, authenticate, authorizeRole(['Admin']), async (req, res) => {
    try {
        const { status } = req.query;
        
        const where = { trialId: req.params.id };
        if (status) where.status = status;
        
        const applications = await prisma.trialApplication.findMany({
            where,
            include: { player: { select: { id: true, username: true, firstName: true, lastName: true, position: true, age: true } } }
        });
        
        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/trials/:id/application/:applicantId
router.put('/:id/application/:applicantId', [
    param('id').isString().notEmpty(),
    param('applicantId').isString().notEmpty(),
    body('status').isIn(['approved', 'rejected']),
    body('notes').optional().isString()
], handleValidation, authenticate, authorizeRole(['Admin']), async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        const application = await prisma.trialApplication.update({
            where: { trialId_playerId: { trialId: req.params.id, playerId: req.params.applicantId } },
            data: { status, notes: notes || undefined },
            include: { player: true, trial: true }
        });
        
        res.json({ success: true, data: application, message: `Applicant ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
