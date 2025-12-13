import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const migrationsDir = path.resolve('prisma', 'migrations');

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { env: process.env }, (err, stdout, stderr) => {
            if (err) return reject({ err, stdout, stderr });
            resolve({ stdout, stderr });
        });
    });
}

async function main() {
    if (!fs.existsSync('prisma/schema.prisma')) {
        console.error('schema.prisma not found in prisma/');
        process.exit(1);
    }

    if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir, { recursive: true });

    const migrationName = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14) + '_init';
    const migrationPath = path.join(migrationsDir, migrationName);

    if (!fs.existsSync(migrationPath)) {
        fs.mkdirSync(migrationPath, { recursive: true });
        fs.writeFileSync(path.join(migrationPath, 'migration.sql'), '-- Prisma baseline migration (no-op)\n-- This marks the current database schema as the baseline for Prisma migrations.');
        console.log('Created baseline migration:', migrationName);
    } else {
        console.log('Baseline migration already exists:', migrationName);
    }

    try {
        // Require an explicit allow flag when not in development
        if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_DEV_TOOLS !== 'true') {
            console.error('baselinePrisma.js should only run in development or when ALLOW_DEV_TOOLS=true. Aborting.');
            process.exit(1);
        }

        console.log('Marking migration as applied in the database...');
        await run(`npx prisma migrate resolve --applied ${migrationName}`);
        console.log('✅ Migration marked as applied.');

        console.log('Generating Prisma client...');
        await run('npx prisma generate');
        console.log('✅ Prisma client generated.');
    } catch (e) {
        console.error('Error during baseline process:', e?.stderr || e?.err || e);
        process.exit(1);
    }
}

main();
