import prisma from '../src/utils/prisma.js';
import bcrypt from 'bcryptjs';

// Safety: only allow seeding in development or when explicitly allowed
if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_SEED !== 'true') {
    console.error('Seeding is disabled in production. Set NODE_ENV=development or ALLOW_SEED=true to run this script.');
    process.exit(1);
}

const seedDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('🌱 Seeding database (idempotent)...');

        // Upsert scout (idempotent)
        const hashedPassword = await bcrypt.hash('password123', 10);
        const scout = await prisma.scout.upsert({
            where: { email: 'john@naijascout.com' },
            update: { club: 'Lagos United', name: 'John Doe' },
            create: {
                name: 'John Doe',
                email: 'john@naijascout.com',
                password: hashedPassword,
                club: 'Lagos United'
            }
        });
        console.log('✅ Ensured scout:', scout.email);

        // Upsert players (idempotent)
        const playersData = [
            {
                username: 'victor_osimhen',
                firstName: 'Victor',
                lastName: 'Osimhen',
                position: 'Forward',
                club: 'Napoli',
                age: 24,
                nationality: 'Nigerian',
                overallRating: 88,
                potential: 92,
                profilePicture: 'osimhen.jpg',
                marketValue: 80000000,
                demandScore: 95
            },
            {
                username: 'samuel_chukwueze',
                firstName: 'Samuel',
                lastName: 'Chukwueze',
                position: 'Forward',
                club: 'AC Milan',
                age: 24,
                nationality: 'Nigerian',
                overallRating: 79,
                potential: 85,
                profilePicture: 'chukwueze.jpg',
                marketValue: 45000000,
                demandScore: 75
            },
            {
                username: 'wilfred_ndidi',
                firstName: 'Wilfred',
                lastName: 'Ndidi',
                position: 'Midfielder',
                club: 'Leicester City',
                age: 26,
                nationality: 'Nigerian',
                overallRating: 77,
                potential: 80,
                profilePicture: 'ndidi.jpg',
                marketValue: 40000000,
                demandScore: 60
            }
        ];

        for (const p of playersData) {
            await prisma.player.upsert({
                where: { username: p.username },
                update: { ...p },
                create: p
            });
        }
        const totalPlayers = await prisma.player.count();
        console.log(`✅ Ensured players. Total players now: ${totalPlayers}`);

        // Create shortlist entries if missing (skip duplicates)
        const allPlayers = await prisma.player.findMany({ where: { username: { in: playersData.map(x => x.username) } } });
        const victor = allPlayers.find(x => x.username === 'victor_osimhen');
        const samuel = allPlayers.find(x => x.username === 'samuel_chukwueze');
        if (victor && samuel) {
            const shortlistItems = [
                { scoutId: scout.id, playerId: victor.id, notes: 'Excellent striker, highly recommended' },
                { scoutId: scout.id, playerId: samuel.id, notes: 'Promising talent, good market value' }
            ];

            for (const item of shortlistItems) {
                const exists = await prisma.shortlist.findFirst({ where: { scoutId: item.scoutId, playerId: item.playerId } });
                if (!exists) {
                    await prisma.shortlist.create({ data: item });
                }
            }
            console.log('✅ Ensured shortlist entries');
        }

        // Create sample matches but avoid duplicates by checking count
        const existingMatches = await prisma.match.count();
        if (existingMatches === 0 && victor && samuel) {
            await prisma.match.createMany({
                data: [
                    { playerId: victor.id, opponent: 'AC Milan', date: new Date('2024-01-15'), rating: 8.5, goals: 2, assists: 1, result: 'W' },
                    { playerId: victor.id, opponent: 'Roma', date: new Date('2024-01-22'), rating: 7.8, goals: 1, assists: 0, result: 'D' },
                    { playerId: samuel.id, opponent: 'Inter', date: new Date('2024-01-18'), rating: 7.2, goals: 0, assists: 2, result: 'W' }
                ]
            });
            console.log('✅ Created sample match records');
        } else {
            console.log('ℹ️ Sample matches skipped (existing matches found)');
        }

        console.log('🎉 Database seeded (idempotent) successfully!');
        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

seedDatabase();
