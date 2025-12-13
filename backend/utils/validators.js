import { body, param, query, validationResult } from 'express-validator';

export const validatePlayer = [
    body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name is required and must be less than 50 characters'),
    body('age').isInt({ min: 16, max: 50 }).withMessage('Age must be between 16 and 50'),
    body('position').isIn(['Forward', 'Midfielder', 'Defender', 'Goalkeeper']).withMessage('Invalid position'),
    body('nationality').optional().isString().isLength({ min: 2, max: 50 }).withMessage('Nationality must be a string'),
    body('club').optional().isString().isLength({ min: 1, max: 100 }).withMessage('Club must be a string'),
    body('engagement.goals').isInt({ min: 0 }).withMessage('Goals must be a non-negative integer'),
    body('engagement.assists').isInt({ min: 0 }).withMessage('Assists must be a non-negative integer'),
    body('engagement.interactions').isInt({ min: 0 }).withMessage('Interactions must be a non-negative integer'),
    body('engagement.matches').optional().isInt({ min: 0 }).withMessage('Matches must be a non-negative integer'),
    body('engagement.minutes').optional().isInt({ min: 0 }).withMessage('Minutes must be a non-negative integer'),
    body('stats.pace').optional().isInt({ min: 0, max: 100 }).withMessage('Pace must be between 0 and 100'),
    body('stats.shooting').optional().isInt({ min: 0, max: 100 }).withMessage('Shooting must be between 0 and 100'),
    body('stats.passing').optional().isInt({ min: 0, max: 100 }).withMessage('Passing must be between 0 and 100'),
    body('stats.dribbling').optional().isInt({ min: 0, max: 100 }).withMessage('Dribbling must be between 0 and 100'),
    body('stats.defending').optional().isInt({ min: 0, max: 100 }).withMessage('Defending must be between 0 and 100'),
    body('stats.physical').optional().isInt({ min: 0, max: 100 }).withMessage('Physical must be between 0 and 100'),
    body('status').optional().isIn(['active', 'inactive', 'scouted', 'signed']).withMessage('Invalid status'),
    body('image').optional().isString().isLength({ max: 300 }).withMessage('Image must be a string'),
];

export const validatePlayerQuery = [
    query('sort').optional().isString().isIn(['scoutPoints', 'age', 'name', 'position', 'status']).withMessage('Invalid sort field'),
    query('order').optional().isString().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
    query('position').optional().isString().isIn(['Forward', 'Midfielder', 'Defender', 'Goalkeeper']).withMessage('Invalid position'),
    query('status').optional().isString().isIn(['active', 'inactive', 'scouted', 'signed']).withMessage('Invalid status'),
];

export const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation error');
        err.status = 400;
        err.errors = errors.array();
        return next(err);
    }
    next();
};
