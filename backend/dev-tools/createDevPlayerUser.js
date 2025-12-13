import prisma from '../src/utils/prisma.js';
import bcrypt from 'bcryptjs';

// Protect this script: only run in development or when explicitly allowed
if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_DEV_TOOLS !== 'true') {
    console.error('createDevPlayerUser.js is for development only. Set NODE_ENV=development or ALLOW_DEV_TOOLS=true to run.');
    process.exit(1);
}

async function main() {
    await prisma.$connect();
    const username = 'victor_osimhen';
    const email = 'victor@naijascout.dev';
    const name = 'Victor Osimhen';
    const password = 'password123';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('User already exists:', email);
        await prisma.$disconnect();
        return;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            username,
            email,
            passwordHash: hash,
            role: 'player'
        }
    });

    console.log('Created dev player user:', user.id, user.email);
    await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
