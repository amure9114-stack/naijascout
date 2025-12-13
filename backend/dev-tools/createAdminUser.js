import prisma from '../src/utils/prisma.js';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Protect this script: only run in development or when explicitly allowed
if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_DEV_TOOLS !== 'true') {
    console.error('createAdminUser.js is for development only. Set NODE_ENV=development or ALLOW_DEV_TOOLS=true to run.');
    process.exit(1);
}

async function main() {
    await prisma.$connect();

    const email = process.env.ADMIN_EMAIL || 'admin@naijascout.local';
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMeNow!';
    const name = process.env.ADMIN_NAME || 'Administrator';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('Admin user already exists:', email);
        await prisma.$disconnect();
        return;
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
        data: {
            name,
            username,
            email,
            passwordHash: hash,
            role: 'admin'
        }
    });

    console.log('Created admin user:');
    console.log('  id:   ', user.id);
    console.log('  email:', user.email);
    console.log('  username:', user.username);
    console.log('\nIMPORTANT: rotate this password for production and store credentials in a secrets manager.');

    await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
