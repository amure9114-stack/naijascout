import prisma from '../utils/prisma.js';

export const createMatch = async (req, res, next) => {
    try {
        const { playerId, opponent, date, rating, goals, assists, result } = req.body;

        const match = await prisma.match.create({
            data: {
                playerId: parseInt(playerId),
                opponent,
                date: new Date(date),
                rating: parseFloat(rating),
                goals: parseInt(goals),
                assists: parseInt(assists),
                result
            }
        });

        res.status(201).json({ success: true, data: match });
    } catch (error) {
        next(error);
    }
};

export const getMatchesByPlayer = async (req, res, next) => {
    try {
        const { playerId } = req.params;
        const { limit, startDate, endDate } = req.query;

        const where = { playerId: parseInt(playerId) };
        
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const matches = await prisma.match.findMany({
            where,
            orderBy: { date: 'desc' },
            take: limit ? parseInt(limit) : undefined
        });

        res.json({ success: true, data: matches });
    } catch (error) {
        next(error);
    }
};

export const getCurrentPlayerMatches = async (req, res, next) => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            const err = new Error('Not authenticated');
            err.status = 401;
            return next(err);
        }

        // Get user to find username
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        // Find player by username
        const player = await prisma.player.findUnique({
            where: { username: user.username }
        });

        if (!player) {
            const err = new Error('Player profile not found');
            err.status = 404;
            return next(err);
        }

        const { limit, startDate, endDate } = req.query;
        const where = { playerId: player.id };
        
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const matches = await prisma.match.findMany({
            where,
            orderBy: { date: 'desc' },
            take: limit ? parseInt(limit) : undefined
        });

        res.json({ success: true, data: matches });
    } catch (error) {
        next(error);
    }
};
