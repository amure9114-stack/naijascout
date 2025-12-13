import Shortlist from '../models/Shortlist.js';

export const getShortlist = async (req, res, next) => {
    try {
        const items = await Shortlist.find().populate('player user');
        res.json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

export const addToShortlist = async (req, res, next) => {
    try {
        const item = await Shortlist.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

export const removeFromShortlist = async (req, res, next) => {
    try {
        const item = await Shortlist.findByIdAndDelete(req.params.id);
        if (!item) {
            const err = new Error('Shortlist item not found');
            err.status = 404;
            return next(err);
        }
        res.json({ success: true, message: 'Removed from shortlist' });
    } catch (error) {
        next(error);
    }
};
