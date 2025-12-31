import prisma from '../utils/prisma.js';

export const getInjuries = async (req, res, next) => {
    try {
        const { playerId } = req.query;
        const where = {};
        
        if (playerId) {
            where.playerId = parseInt(playerId);
        }

        const injuries = await prisma.injury.findMany({
            where,
            orderBy: { dateInjured: 'desc' },
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
        });

        res.json({ success: true, data: injuries });
    } catch (error) {
        next(error);
    }
};

export const getInjuryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const injury = await prisma.injury.findUnique({
            where: { id: parseInt(id) },
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
        });

        if (!injury) {
            const err = new Error('Injury not found');
            err.status = 404;
            return next(err);
        }

        res.json({ success: true, data: injury });
    } catch (error) {
        next(error);
    }
};

export const createInjury = async (req, res, next) => {
    try {
        const { playerId, injuryType, bodyPart, severity, status, dateInjured, expectedRecovery, description } = req.body;

        if (!playerId || !injuryType || !bodyPart || !severity || !dateInjured) {
            const err = new Error('Missing required fields');
            err.status = 400;
            return next(err);
        }

        const injury = await prisma.injury.create({
            data: {
                playerId: parseInt(playerId),
                injuryType,
                bodyPart,
                severity,
                status: status || 'active',
                dateInjured: new Date(dateInjured),
                expectedRecovery: expectedRecovery ? new Date(expectedRecovery) : null,
                description
            },
            include: {
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        res.status(201).json({ success: true, data: injury });
    } catch (error) {
        next(error);
    }
};

export const updateInjury = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = {};

        const allowed = ['injuryType', 'bodyPart', 'severity', 'status', 'dateInjured', 'expectedRecovery', 'actualRecovery', 'description'];
        
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (['dateInjured', 'expectedRecovery', 'actualRecovery'].includes(field)) {
                    updateData[field] = req.body[field] ? new Date(req.body[field]) : null;
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        const injury = await prisma.injury.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        res.json({ success: true, data: injury });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Injury not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};

export const deleteInjury = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.injury.delete({
            where: { id: parseInt(id) }
        });

        res.json({ success: true, message: 'Injury deleted' });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Injury not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};

export const getPlayerInjuries = async (req, res, next) => {
    try {
        const { playerId } = req.params;

        const injuries = await prisma.injury.findMany({
            where: { playerId: parseInt(playerId) },
            orderBy: { dateInjured: 'desc' }
        });

        // Calculate stats
        const active = injuries.filter(i => i.status === 'active').length;
        const recovering = injuries.filter(i => i.status === 'recovering').length;
        const recovered = injuries.filter(i => i.status === 'recovered');
        
        const avgRecoveryDays = recovered.length > 0
            ? recovered.reduce((acc, injury) => {
                const injured = new Date(injury.dateInjured);
                const recovered = injury.actualRecovery 
                    ? new Date(injury.actualRecovery)
                    : injury.expectedRecovery 
                        ? new Date(injury.expectedRecovery)
                        : new Date();
                return acc + Math.ceil((recovered.getTime() - injured.getTime()) / (1000 * 60 * 60 * 24));
            }, 0) / recovered.length
            : 0;

        res.json({
            success: true,
            data: injuries,
            stats: {
                total: injuries.length,
                active,
                recovering,
                recovered: recovered.length,
                avgRecoveryDays: Math.round(avgRecoveryDays)
            }
        });
    } catch (error) {
        next(error);
    }
};




