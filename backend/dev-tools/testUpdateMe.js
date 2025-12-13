import prisma from '../src/utils/prisma.js';
import { updateCurrentPlayer } from '../src/controllers/player.controller.js';

// Protect this script: only run in development or when explicitly allowed
if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_DEV_TOOLS !== 'true') {
    console.error('testUpdateMe.js is for development only. Set NODE_ENV=development or ALLOW_DEV_TOOLS=true to run.');
    process.exit(1);
}

const makeRes = () => {
    return {
        status(code) { this._status = code; return this; },
        json(payload) { console.log('RESPONSE:', JSON.stringify(payload, null, 2)); return payload; }
    };
};

async function main() {
    await prisma.$connect();

    // Find the dev user we created
    const user = await prisma.user.findUnique({ where: { email: 'victor@naijascout.dev' } });
    if (!user) { console.error('Dev user not found'); process.exit(1); }

    const req = {
        user: { sub: user.id, role: user.role, username: user.username },
        body: { club: 'E2E Test Club', age: 26 }
    };

    console.log('Running updateCurrentPlayer for user id', user.id);
    await updateCurrentPlayer(req, makeRes(), (err) => { if (err) console.error('Controller error:', err); });

    // Verify in DB
    const player = await prisma.player.findUnique({ where: { username: user.username } });
    console.log('PLAYER IN DB:', player);

    await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
