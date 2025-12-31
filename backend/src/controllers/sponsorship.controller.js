import prisma from '../utils/prisma.js';

export const getSponsorships = async (req, res, next) => {
    try {
        const { type, location, isActive } = req.query;
        const where = {};

        if (type) where.type = type;
        if (location) where.location = { contains: location };
        if (isActive !== undefined) where.isActive = isActive === 'true';

        const sponsorships = await prisma.sponsorship.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });

        res.json({ success: true, data: sponsorships });
    } catch (error) {
        next(error);
    }
};

export const getSponsorshipById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const sponsorship = await prisma.sponsorship.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: { applications: true }
                }
            }
        });

        if (!sponsorship) {
            const err = new Error('Sponsorship not found');
            err.status = 404;
            return next(err);
        }

        res.json({ success: true, data: sponsorship });
    } catch (error) {
        next(error);
    }
};

export const createSponsorship = async (req, res, next) => {
    try {
        const { name, type, amount, period, location, focus, description, requirements, benefits } = req.body;

        if (!name || !type || !amount || !location) {
            const err = new Error('Missing required fields');
            err.status = 400;
            return next(err);
        }

        const sponsorship = await prisma.sponsorship.create({
            data: {
                name,
                type,
                amount,
                period: period || 'per year',
                location,
                focus,
                description,
                requirements: requirements ? JSON.stringify(requirements) : null,
                benefits: benefits ? JSON.stringify(benefits) : null
            }
        });

        res.status(201).json({ success: true, data: sponsorship });
    } catch (error) {
        next(error);
    }
};

export const applyForSponsorship = async (req, res, next) => {
    try {
        const { sponsorshipId } = req.params;
        const { playerId, fullName, email, phone, location, position, experience, achievements, goals } = req.body;

        if (!playerId || !fullName || !email || !phone) {
            const err = new Error('Missing required fields');
            err.status = 400;
            return next(err);
        }

        // Check if already applied
        const existing = await prisma.sponsorshipApplication.findFirst({
            where: {
                sponsorshipId: parseInt(sponsorshipId),
                playerId: parseInt(playerId)
            }
        });

        if (existing) {
            const err = new Error('Already applied for this sponsorship');
            err.status = 400;
            return next(err);
        }

        const application = await prisma.sponsorshipApplication.create({
            data: {
                sponsorshipId: parseInt(sponsorshipId),
                playerId: parseInt(playerId),
                fullName,
                email,
                phone,
                location,
                position,
                experience,
                achievements,
                goals
            },
            include: {
                sponsorship: true,
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

        const applications = await prisma.sponsorshipApplication.findMany({
            where: { playerId: parseInt(playerId) },
            include: {
                sponsorship: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: applications });
    } catch (error) {
        next(error);
    }
};

export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            const err = new Error('Invalid status');
            err.status = 400;
            return next(err);
        }

        const application = await prisma.sponsorshipApplication.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                sponsorship: true,
                player: true
            }
        });

        res.json({ success: true, data: application });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Application not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};




