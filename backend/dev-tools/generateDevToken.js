import prisma from '../src/utils/prisma.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Protect this script: only run in development or when explicitly allowed
if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_DEV_TOOLS !== 'true') {
    console.error('generateDevToken.js is for development only. Set NODE_ENV=development or ALLOW_DEV_TOOLS=true to run.');
    process.exit(1);
}

async function main() {
    await prisma.$connect();
    const email = 'victor@naijascout.dev';
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.error('User not found:', email);
        await prisma.$disconnect();
        process.exit(1);
    }

    const payload = {
        sub: user.id,
        role: user.role,
        username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret-key-change-in-production', { expiresIn: '7d' });
    console.log('DEV_JWT=' + token);
    await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
