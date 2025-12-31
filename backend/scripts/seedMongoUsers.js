import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import 'dotenv/config';

// Guard: only run in development or when explicitly allowed
if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_DEV_TOOLS !== 'true') {
    console.error('seedMongoUsers.js is for development only. Set NODE_ENV=development or ALLOW_DEV_TOOLS=true to run.');
    process.exit(1);
}

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) {
    console.error('Missing MONGODB_URI/MONGO_URI. Set this environment variable and try again.');
    process.exit(1);
}

const email = (process.env.ADMIN_EMAIL || 'admin@naijascout.local').toLowerCase();
const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'ChangeMeNow';
const name = process.env.ADMIN_NAME || 'Administrator';
const role = process.env.ADMIN_ROLE || 'admin';

async function main() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
        const db = mongoose.connection.db;

        const users = db.collection('users');
        const existing = await users.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            console.log('Admin user already exists:', existing.email || existing.username);
            await mongoose.disconnect();
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const doc = {
            name,
            username,
            email,
            passwordHash,
            role,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await users.insertOne(doc);
        console.log('Inserted admin user with _id:', result.insertedId.toString());
        console.log('Important: change the default password and store credentials securely.');

        await mongoose.disconnect();
    } catch (e) {
        console.error('Failed to seed MongoDB users:', e.message || e);
        process.exit(1);
    }
}

main();
