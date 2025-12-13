import Player from '../models/Player.js';
import connectDB from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const samplePlayers = [
    // Minimal sample set kept for brevity; original full set exists in root seedData.js
    {
        name: 'Victor Osimhen',
        position: 'Forward',
        age: 24,
        nationality: 'Nigerian',
        club: 'Napoli',
        engagement: { goals: 26, assists: 4, interactions: 45, matches: 32, minutes: 2880 },
        stats: { pace: 89, shooting: 85, passing: 64, dribbling: 78, defending: 35, physical: 82 },
        status: 'active',
        image: '/avatar-icon.png'
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        await Player.deleteMany({});
        const players = await Player.insertMany(samplePlayers);
        console.log(`Seeded ${players.length} players`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database', error);
        process.exit(1);
    }
};

seedDatabase();
