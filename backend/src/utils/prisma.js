import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Default to naijascout.db in the backend folder if DATABASE_URL not provided
const defaultDbPath = path.join(__dirname, '../../naijascout.db');
if (!process.env.DATABASE_URL) {
    // Use absolute file path to avoid relative resolution issues
    const absolute = path.resolve(defaultDbPath).replace(/\\/g, '/');
    process.env.DATABASE_URL = `file:${absolute}`;
}

const prisma = new PrismaClient();

export default prisma;
