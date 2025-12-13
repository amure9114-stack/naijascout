import Player from '../models/Player.js';

// Get all players
export const getPlayers = async (req, res, next) => {
    try {
        const { sort = 'scoutPoints', order = 'desc', limit = 10, page = 1, position, status } = req.query;
        const filter = {};
        if (position) filter.position = position;
        if (status) filter.status = status;
        const sortObj = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const players = await Player.find(filter)
            .sort(sortObj)
            .limit(parseInt(limit))
            .skip(skip);
        const total = await Player.countDocuments(filter);
        res.json({
            success: true,
            count: players.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            },
            data: players
        });
    } catch (error) {
        next(error);
    }
};

// Get single player
export const getPlayer = async (req, res, next) => {
    try {
        const player = await Player.findById(req.params.id);
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

// Create new player
export const createPlayer = async (req, res, next) => {
    try {
        const player = await Player.create(req.body);
        res.status(201).json({ success: true, data: player });
    } catch (error) {
        if (error.code === 11000) {
            const err = new Error('Player already exists');
            err.status = 400;
            return next(err);
        }
        next(error);
    }
};

// Update player
export const updatePlayer = async (req, res, next) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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

// Delete player
export const deletePlayer = async (req, res, next) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            const err = new Error('Player not found');
            err.status = 404;
            return next(err);
        }
        res.json({ success: true, message: 'Player deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Stats overview
export const getStatsOverview = async (req, res, next) => {
    try {
        const stats = await Player.aggregate([
            {
                $group: {
                    _id: null,
                    totalPlayers: { $sum: 1 },
                    avgScoutPoints: { $avg: '$scoutPoints' },
                    maxScoutPoints: { $max: '$scoutPoints' },
                    totalGoals: { $sum: '$engagement.goals' },
                    totalAssists: { $sum: '$engagement.assists' },
                    totalInteractions: { $sum: '$engagement.interactions' },
                    avgAge: { $avg: '$age' }
                }
            }
        ]);
        const positionStats = await Player.aggregate([
            {
                $group: {
                    _id: '$position',
                    count: { $sum: 1 },
                    avgScoutPoints: { $avg: '$scoutPoints' }
                }
            }
        ]);
        res.json({ success: true, data: { overview: stats[0] || {}, positions: positionStats } });
    } catch (error) {
        next(error);
    }
};
