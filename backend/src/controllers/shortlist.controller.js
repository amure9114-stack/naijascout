import prisma from '../utils/prisma.js';

export const getShortlists = async (req, res, next) => {
    try {
        const { id } = req.user;

        const shortlists = await prisma.shortlist.findMany({
            where: { scoutId: parseInt(id) },
            include: { player: true }
        });

        res.json({ success: true, data: shortlists });
    } catch (error) {
        next(error);
    }
};

export const addToShortlist = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { playerId, notes } = req.body;

        const existing = await prisma.shortlist.findUnique({
            where: { scoutId_playerId: { scoutId: parseInt(id), playerId: parseInt(playerId) } }
        });

        if (existing) {
            const err = new Error('Player already in shortlist');
            err.status = 400;
            return next(err);
        }

        const shortlist = await prisma.shortlist.create({
            data: {
                scoutId: parseInt(id),
                playerId: parseInt(playerId),
                notes
            },
            include: { player: true }
        });

        res.status(201).json({ success: true, data: shortlist });
    } catch (error) {
        next(error);
    }
};

export const removeFromShortlist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: scoutId } = req.user;

        const shortlist = await prisma.shortlist.findUnique({
            where: { id: parseInt(id) }
        });

        if (!shortlist || shortlist.scoutId !== parseInt(scoutId)) {
            const err = new Error('Shortlist item not found');
            err.status = 404;
            return next(err);
        }

        await prisma.shortlist.delete({ where: { id: parseInt(id) } });

        res.json({ success: true, message: 'Removed from shortlist' });
    } catch (error) {
        next(error);
    }
};
