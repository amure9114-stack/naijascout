import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerScout = async (req, res, next) => {
    try {
        const { name, email, password, club } = req.body;

        const existingScout = await prisma.scout.findUnique({ where: { email } });
        if (existingScout) {
            const err = new Error('Email already registered');
            err.status = 400;
            return next(err);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const scout = await prisma.scout.create({
            data: {
                name,
                email,
                password: hashedPassword,
                club
            }
        });

        res.status(201).json({
            success: true,
            data: { id: scout.id, name: scout.name, email: scout.email }
        });
    } catch (error) {
        next(error);
    }
};

export const loginScout = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const scout = await prisma.scout.findUnique({ where: { email } });
        if (!scout) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            return next(err);
        }

        const isValidPassword = await bcrypt.compare(password, scout.password);
        if (!isValidPassword) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            return next(err);
        }

        const token = jwt.sign(
            { id: scout.id, email: scout.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            data: { token, scout: { id: scout.id, name: scout.name, email: scout.email } }
        });
    } catch (error) {
        next(error);
    }
};
