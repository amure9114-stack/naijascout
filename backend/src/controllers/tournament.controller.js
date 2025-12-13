import prisma from '../utils/prisma.js';

export const getTournaments = async (req, res, next) => {
    try {
        const { category, isActive, playerId } = req.query;
        const where = {};

        if (category) where.category = category;
        if (isActive !== undefined) where.isActive = isActive === 'true';
        if (playerId) {
            where.registrations = {
                some: {
                    playerId: parseInt(playerId)
                }
            };
        }

        const tournaments = await prisma.tournament.findMany({
            where,
            orderBy: { startDate: 'asc' },
            include: {
                _count: {
                    select: { registrations: true }
                }
            }
        });

        res.json({ success: true, data: tournaments });
    } catch (error) {
        next(error);
    }
};

export const getTournamentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const tournament = await prisma.tournament.findUnique({
            where: { id: parseInt(id) },
            include: {
                registrations: {
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
                    select: { registrations: true }
                }
            }
        });

        if (!tournament) {
            const err = new Error('Tournament not found');
            err.status = 404;
            return next(err);
        }

        res.json({ success: true, data: tournament });
    } catch (error) {
        next(error);
    }
};

export const createTournament = async (req, res, next) => {
    try {
        const { name, location, startDate, endDate, description, category } = req.body;

        if (!name || !location || !startDate) {
            const err = new Error('Missing required fields');
            err.status = 400;
            return next(err);
        }

        const tournament = await prisma.tournament.create({
            data: {
                name,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                description,
                category
            }
        });

        res.status(201).json({ success: true, data: tournament });
    } catch (error) {
        next(error);
    }
};

export const registerForTournament = async (req, res, next) => {
    try {
        const { tournamentId } = req.params;
        const { playerId } = req.body;

        if (!playerId) {
            const err = new Error('Player ID required');
            err.status = 400;
            return next(err);
        }

        // Check if already registered
        const existing = await prisma.tournamentRegistration.findFirst({
            where: {
                tournamentId: parseInt(tournamentId),
                playerId: parseInt(playerId)
            }
        });

        if (existing) {
            const err = new Error('Already registered for this tournament');
            err.status = 400;
            return next(err);
        }

        const registration = await prisma.tournamentRegistration.create({
            data: {
                tournamentId: parseInt(tournamentId),
                playerId: parseInt(playerId),
                status: 'registered'
            },
            include: {
                tournament: true,
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        res.status(201).json({ success: true, data: registration });
    } catch (error) {
        next(error);
    }
};

export const getPlayerTournaments = async (req, res, next) => {
    try {
        const { playerId } = req.params;

        const registrations = await prisma.tournamentRegistration.findMany({
            where: { playerId: parseInt(playerId) },
            include: {
                tournament: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: registrations });
    } catch (error) {
        next(error);
    }
};


