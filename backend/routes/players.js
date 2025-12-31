import express from 'express';
import Player from '../models/Player.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { body, param, query, validationResult } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Players
 *   description: Player management and statistics
 */

/**
 * @swagger
 * /api/players:
 *   get:
 *     summary: Get all players
 *     tags: [Players]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [scoutPoints, age, name, position, status]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *           enum: [Forward, Midfielder, Defender, Goalkeeper]
 *         description: Filter by position
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, scouted, signed]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of players
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *
 *   post:
 *     summary: Create a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       201:
 *         description: Player created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *       400:
 *         description: Validation error
 *
 * /api/players/{id}:
 *   get:
 *     summary: Get a player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 *
 *   put:
 *     summary: Update a player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Player'
 *     responses:
 *       200:
 *         description: Player updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Player'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Player not found
 *
 *   delete:
 *     summary: Delete a player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Player not found
 *
 * /api/players/stats/overview:
 *   get:
 *     summary: Get player statistics overview
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: Player statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         position:
 *           type: string
 *         age:
 *           type: integer
 *         nationality:
 *           type: string
 *         club:
 *           type: string
 *         engagement:
 *           type: object
 *           properties:
 *             goals:
 *               type: integer
 *             assists:
 *               type: integer
 *             interactions:
 *               type: integer
 *             matches:
 *               type: integer
 *             minutes:
 *               type: integer
 *         stats:
 *           type: object
 *           properties:
 *             pace:
 *               type: integer
 *             shooting:
 *               type: integer
 *             passing:
 *               type: integer
 *             dribbling:
 *               type: integer
 *             defending:
 *               type: integer
 *             physical:
 *               type: integer
 *         scoutPoints:
 *           type: integer
 *         status:
 *           type: string
 *         image:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
// Validation middleware for player creation/updating
const validatePlayer = [
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

// Validation middleware for query params (GET /api/players)
const validatePlayerQuery = [
  query('sort').optional().isString().isIn(['scoutPoints', 'age', 'name', 'position', 'status']).withMessage('Invalid sort field'),
  query('order').optional().isString().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('position').optional().isString().isIn(['Forward', 'Midfielder', 'Defender', 'Goalkeeper']).withMessage('Invalid position'),
  query('status').optional().isString().isIn(['active', 'inactive', 'scouted', 'signed']).withMessage('Invalid status'),
];

// Helper: handle validation errors
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

// Map UI positions to canonical values
const normalizePosition = (pos) => {
  if (!pos) return undefined;
  const normalized = pos.toString().trim().toLowerCase();
  const map = {
    forward: 'forward',
    striker: 'forward',
    midfielder: 'midfielder',
    defender: 'defender',
    goalkeeper: 'goalkeeper',
    gk: 'goalkeeper'
  };
  return map[normalized] || normalized;
};

// Build an update payload for the authenticated player's profile
const buildProfileUpdate = (body, user) => {
  const normalizedPosition = normalizePosition(body.position);
  const firstName = body.firstName || user?.name?.split(' ')[0];
  const lastName = body.lastName || user?.name?.split(' ').slice(1).join(' ');
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || body.name || user?.name || 'Player';

  return {
    user: user?._id,
    username: user?.username,
    name: fullName,
    firstName,
    lastName,
    dateOfBirth: body.dateOfBirth || undefined,
    age: body.age || undefined,
    email: body.email || user?.email,
    phone: body.phone || undefined,
    nationality: body.nationality || undefined,
    position: normalizedPosition,
    jerseyNumber: body.jerseyNumber || undefined,
    preferredFoot: body.preferredFoot || undefined,
    club: body.club || undefined,
    bio: body.bio || undefined,
    story: body.story || undefined,
    profilePicture: body.profilePicture || body.profilePictureUrl || undefined,
    highlightsLink: body.highlightsLink || undefined,
    height: body.height || undefined,
    weight: body.weight || undefined,
    overallRating: body.overallRating || undefined,
    potential: body.potential || undefined,
    engagement: {
      goals: typeof body.goals === 'number' ? body.goals : body.goals ? Number(body.goals) : undefined,
      assists: typeof body.assists === 'number' ? body.assists : body.assists ? Number(body.assists) : undefined,
      matches: typeof body.matches === 'number' ? body.matches : body.matches ? Number(body.matches) : undefined,
      interactions: undefined,
      minutes: undefined
    }
  };
};

// @desc    Get all players
// @route   GET /api/players
// @access  Public
router.get('/', validatePlayerQuery, handleValidation, async (req, res, next) => {
  try {
    const { sort = 'scoutPoints', order = 'desc', limit = 10, page = 1, position, status } = req.query;
    // Build filter object
    const filter = {};
    if (position) filter.position = position;
    if (status) filter.status = status;
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    // Pagination
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
});

// @desc    Get current authenticated player profile
// @route   GET /api/players/me
// @access  Private (Player)
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const player = await Player.findOne({ user: user._id }) || await Player.findOne({ username: user.username });
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player profile not found' });
    }

    const data = player.toObject();
    data.id = data._id?.toString();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// @desc    Upsert current authenticated player profile
// @route   PUT /api/players/me
// @access  Private (Player)
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const update = buildProfileUpdate(req.body || {}, user);

    // Preserve existing engagement numbers when not provided
    const existing = await Player.findOne({ user: user._id }) || await Player.findOne({ username: user.username });
    if (existing) {
      update.engagement = {
        goals: update.engagement.goals ?? existing.engagement?.goals ?? 0,
        assists: update.engagement.assists ?? existing.engagement?.assists ?? 0,
        matches: update.engagement.matches ?? existing.engagement?.matches ?? 0,
        interactions: existing.engagement?.interactions ?? 0,
        minutes: existing.engagement?.minutes ?? 0
      };
    } else {
      update.engagement = {
        goals: update.engagement.goals ?? 0,
        assists: update.engagement.assists ?? 0,
        matches: update.engagement.matches ?? 0,
        interactions: 0,
        minutes: 0
      };
    }

    update.scoutPoints = (update.engagement.goals || 0) + (update.engagement.assists || 0) * 2 + (update.engagement.interactions || 0);

    const player = await Player.findOneAndUpdate(
      { user: user._id },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
});

// @desc    Get player by username
// @route   GET /api/players/username/:username
// @access  Public
router.get('/username/:username', async (req, res, next) => {
  try {
    const username = req.params.username?.toLowerCase();
    if (!username) return res.status(400).json({ success: false, message: 'Username is required' });

    const player = await Player.findOne({ username }) || await Player.findOne({ name: new RegExp(`^${username}$`, 'i') });
    if (!player) {
      const err = new Error('Player not found');
      err.status = 404;
      return next(err);
    }
    const data = player.toObject();
    data.id = data._id?.toString();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single player
// @route   GET /api/players/:id
// @access  Public
router.get('/:id', param('id').isMongoId().withMessage('Invalid player ID'), handleValidation, async (req, res, next) => {
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
});

// @desc    Create new player
// @route   POST /api/players
// @access  Public
router.post('/', validatePlayer, handleValidation, async (req, res, next) => {
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
});

// @desc    Update player
// @route   PUT /api/players/:id
// @access  Public
router.put('/:id', param('id').isMongoId().withMessage('Invalid player ID'), validatePlayer, handleValidation, async (req, res, next) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!player) {
      const err = new Error('Player not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete player
// @route   DELETE /api/players/:id
// @access  Public
router.delete('/:id', param('id').isMongoId().withMessage('Invalid player ID'), handleValidation, async (req, res, next) => {
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
});

// @desc    Get player statistics
// @route   GET /api/players/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res, next) => {
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
    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        positions: positionStats
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
