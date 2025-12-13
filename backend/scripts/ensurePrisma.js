import 'dotenv/config';
import { exec } from 'child_process';

const dbUrl = process.env.DATABASE_URL;

function run(command) {
    return new Promise((resolve, reject) => {
        const p = exec(command, { env: process.env }, (error, stdout, stderr) => {
            if (error) return reject({ error, stdout, stderr });
            resolve({ stdout, stderr });
        });
        p.stdout?.pipe(process.stdout);
        p.stderr?.pipe(process.stderr);
    });
}

async function main() {
    if (!dbUrl) {
        console.error('✖ DATABASE_URL is not set. Set it in the environment or .env before running migrations.');
        process.exit(1);
    }

    try {
        console.log('ℹ️ DATABASE_URL found. Generating Prisma client...');
        await run('npx prisma generate');
        console.log('✅ Prisma client generated.');

        console.log('ℹ️ Applying migrations with `prisma migrate deploy`...');
        await run('npx prisma migrate deploy');
        console.log('✅ Migrations applied.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Prisma generation/migration failed:', err?.stderr || err?.error || err);
        process.exit(1);
    }
}

main();