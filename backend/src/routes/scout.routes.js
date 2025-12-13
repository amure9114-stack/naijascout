import express from 'express';
import { registerScout, loginScout } from '../controllers/scout.controller.js';

const router = express.Router();

router.post('/register', registerScout);
router.post('/login', loginScout);

export default router;
