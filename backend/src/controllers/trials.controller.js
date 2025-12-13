import prisma from '../utils/prisma.js';

export const getTrials = async (req, res, next) => {
    try {
        const { date, location, ageGroup } = req.query;
        const where = {};

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setHours(23, 59, 59, 999);
            where.date = {
                gte: start,
                lte: end
            };
        }

        if (location) {
            where.location = { contains: location };
        }

        if (ageGroup) {
            where.ageGroup = ageGroup;
        }

        const trials = await prisma.trial.findMany({
            where,
            orderBy: { date: 'asc' },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });

        res.json({ success: true, data: trials });
    } catch (error) {
        next(error);
    }
};

export const getTrialById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const trial = await prisma.trial.findUnique({
            where: { id: parseInt(id) },
            include: {
                applications: {
                    include: {
                        player: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                username: true
                            }
                        }
                    }
                },
                _count: {
                    select: { applications: true }
                }
            }
        });

        if (!trial) {
            const err = new Error('Trial not found');
            err.status = 404;
            return next(err);
        }

        res.json({ success: true, data: trial });
    } catch (error) {
        next(error);
    }
};

export const createTrial = async (req, res, next) => {
    try {
        const { title, location, ageGroup, time, description, date } = req.body;

        if (!title || !location || !date) {
            const err = new Error('Missing required fields');
            err.status = 400;
            return next(err);
        }

        const trial = await prisma.trial.create({
            data: {
                title,
                location,
                ageGroup,
                time,
                description,
                date: new Date(date)
            }
        });

        res.status(201).json({ success: true, data: trial });
    } catch (error) {
        next(error);
    }
};

export const updateTrial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = {};

        const allowed = ['title', 'location', 'ageGroup', 'time', 'description', 'date'];
        
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === 'date') {
                    updateData[field] = new Date(req.body[field]);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        const trial = await prisma.trial.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json({ success: true, data: trial });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Trial not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};

export const deleteTrial = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.trial.delete({
            where: { id: parseInt(id) }
        });

        res.json({ success: true, message: 'Trial deleted' });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Trial not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};

export const applyForTrial = async (req, res, next) => {
    try {
        const { trialId } = req.params;
        const { playerId, notes } = req.body;

        if (!playerId) {
            const err = new Error('Player ID required');
            err.status = 400;
            return next(err);
        }

        // Check if already applied
        const existing = await prisma.trialApplication.findFirst({
            where: {
                trialId: parseInt(trialId),
                playerId: parseInt(playerId)
            }
        });

        if (existing) {
            const err = new Error('Already applied for this trial');
            err.status = 400;
            return next(err);
        }

        const application = await prisma.trialApplication.create({
            data: {
                trialId: parseInt(trialId),
                playerId: parseInt(playerId),
                status: 'pending',
                notes
            },
            include: {
                trial: true,
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        next(error);
    }
};

export const getPlayerApplications = async (req, res, next) => {
    try {
        const { playerId } = req.params;

        const applications = await prisma.trialApplication.findMany({
            where: { playerId: parseInt(playerId) },
            include: {
                trial: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};
