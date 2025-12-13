import prisma from '../utils/prisma.js';

export const getPlayers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, position, club } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (position) where.position = position;
        if (club) where.club = club;

        const [players, total] = await Promise.all([
            prisma.player.findMany({
                where,
                orderBy: { demandScore: 'desc' },
                take: parseInt(limit),
                skip: skip,
            }),
            prisma.player.count({ where })
        ]);

        res.json({
            success: true,
            data: players,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getPlayerById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const player = await prisma.player.findUnique({
            where: { id: parseInt(id) },
            include: {
                matches: true,
                shortlists: true
            }
        });

        if (!player) {
            const err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }

        res.json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
};

export const getPlayerByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;

        const player = await prisma.player.findUnique({
            where: { username },
            include: {
                matches: true,
                shortlists: true
            }
        });

        if (!player) {
            const err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }

        res.json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
};

export const getCurrentPlayer = async (req, res, next) => {
    try {
        // Get user ID from JWT token (set by auth middleware)
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
            where: { username: user.username },
            include: {
                matches: true,
                shortlists: true
            }
        });

        if (!player) {
            const err = new Error('Player profile not found');
            err.status = 404;
            return next(err);
        }

        res.json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
};

export const createPlayer = async (req, res, next) => {
    try {
        const { username, firstName, lastName, position, club, age, nationality, overallRating, potential, profilePicture, marketValue } = req.body;

        const player = await prisma.player.create({
            data: {
                username: username || `player_${Date.now()}`,
                firstName,
                lastName,
                position,
                club,
                age: parseInt(age),
                nationality,
                overallRating: parseInt(overallRating),
                potential: parseInt(potential),
                profilePicture,
                marketValue: parseFloat(marketValue) || 0
            }
        });

        res.status(201).json({ success: true, data: player });
    } catch (error) {
        if (error.code === 'P2002') {
            const err = new Error('Username already exists');
            err.status = 400;
            return next(err);
        }
        next(error);
    }
};

export const updatePlayer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = {};

        // Allowed fields to update
        const allowed = ['username', 'firstName', 'lastName', 'position', 'club', 'age', 'nationality', 'overallRating', 'potential', 'profilePicture', 'marketValue', 'demandScore'];

        allowed.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (['age', 'overallRating', 'potential', 'demandScore'].includes(field)) {
                    updateData[field] = parseInt(req.body[field]);
                } else if (field === 'marketValue') {
                    updateData[field] = parseFloat(req.body[field]);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        if (Object.keys(updateData).length === 0) {
            const existing = await prisma.player.findUnique({ where: { id: parseInt(id) } });
            if (!existing) {
                const err = new Error('Player not found');
                err.status = 404;
                return next(err);
            }
            return res.json({ success: true, data: existing });
        }

        const player = await prisma.player.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json({ success: true, data: player });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};

export const updateCurrentPlayer = async (req, res, next) => {
    try {
        // Get user ID from JWT token
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

        // Check if user is a player (admins are allowed through)
        const userRoleLower = (user.role || '').toString().toLowerCase();
        if (userRoleLower !== 'player' && userRoleLower !== 'admin') {
            const err = new Error('Only players can update their profile');
            err.status = 403;
            return next(err);
        }

        // Find player by username
        const existingPlayer = await prisma.player.findUnique({
            where: { username: user.username }
        });

        if (!existingPlayer) {
            // Create player profile if it doesn't exist
            const { firstName, lastName, position, club, age, nationality, overallRating, potential, profilePicture, marketValue } = req.body;

            const newPlayer = await prisma.player.create({
                data: {
                    username: user.username,
                    firstName: firstName || user.name.split(' ')[0] || '',
                    lastName: lastName || user.name.split(' ').slice(1).join(' ') || '',
                    position: position || 'Forward',
                    club: club || '',
                    age: parseInt(age) || 18,
                    nationality: nationality || 'Nigerian',
                    overallRating: parseInt(overallRating) || 50,
                    potential: parseInt(potential) || 70,
                    profilePicture,
                    marketValue: parseFloat(marketValue) || 0
                }
            });

            return res.json({ success: true, data: newPlayer });
        }

        // Update existing player
        const updateData = {};
        const allowed = ['firstName', 'lastName', 'position', 'club', 'age', 'nationality', 'overallRating', 'potential', 'profilePicture', 'marketValue', 'demandScore'];

        allowed.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (['age', 'overallRating', 'potential', 'demandScore'].includes(field)) {
                    updateData[field] = parseInt(req.body[field]);
                } else if (field === 'marketValue') {
                    updateData[field] = parseFloat(req.body[field]);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        // Also handle fields from the settings form that might have different names
        if (req.body.firstName !== undefined) updateData.firstName = req.body.firstName;
        if (req.body.lastName !== undefined) updateData.lastName = req.body.lastName;
        if (req.body.bio !== undefined) {
            // Store bio in a field if available, or skip if not in schema
            // For now, we'll skip bio as it's not in the Player schema
        }

        if (Object.keys(updateData).length === 0) {
            return res.json({ success: true, data: existingPlayer });
        }

        const updatedPlayer = await prisma.player.update({
            where: { username: user.username },
            data: updateData
        });

        res.json({ success: true, data: updatedPlayer });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Player profile not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};

export const deletePlayer = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.player.delete({
            where: { id: parseInt(id) }
        });

        res.json({ success: true, message: 'Player deleted' });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};

export const updatePlayerByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        const updateData = {};

        const allowed = ['username', 'firstName', 'lastName', 'position', 'club', 'age', 'nationality', 'overallRating', 'potential', 'profilePicture', 'marketValue', 'demandScore'];

        allowed.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (['age', 'overallRating', 'potential', 'demandScore'].includes(field)) {
                    updateData[field] = parseInt(req.body[field]);
                } else if (field === 'marketValue') {
                    updateData[field] = parseFloat(req.body[field]);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        if (Object.keys(updateData).length === 0) {
            const existing = await prisma.player.findUnique({ where: { username } });
            if (!existing) {
                const err = new Error('Player not found');
                err.status = 404;
                return next(err);
            }
            return res.json({ success: true, data: existing });
        }

        const player = await prisma.player.update({
            where: { username },
            data: updateData
        });

        res.json({ success: true, data: player });
    } catch (error) {
        if (error.code === 'P2025') {
            const err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }
        next(error);
    }
};
