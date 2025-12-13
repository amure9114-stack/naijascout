import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { getShortlist, addToShortlist, removeFromShortlist } from '../controllers/shortlistController.js';

const router = express.Router();

const validate = [
    body('user').isMongoId().withMessage('Invalid user id'),
    body('player').isMongoId().withMessage('Invalid player id')
];

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation error');
        err.status = 400;
        err.errors = errors.array();
        return next(err);
    }
    next();
};

router.get('/', getShortlist);
router.post('/', validate, handleValidation, addToShortlist);
router.delete('/:id', param('id').isMongoId().withMessage('Invalid id'), handleValidation, removeFromShortlist);

export default router;
