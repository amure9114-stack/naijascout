import dotenv from 'dotenv';
dotenv.config();

import prisma from '../src/utils/prisma.js';

(async () => {
  try {
    const count = await prisma.player.count();
    console.log('✅ Prisma connected. Player count:', count);
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Prisma test failed:', err);
    try { await prisma.$disconnect(); } catch (e) { }
    process.exit(2);
  }
})();
