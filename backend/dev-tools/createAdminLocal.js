import User from '../models/User.js';
import 'dotenv/config';

// Guarded: only run in development or with ALLOW_DEV_TOOLS
if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_DEV_TOOLS !== 'true') {
  console.error('createAdminLocal.js is for development only. Set NODE_ENV=development or ALLOW_DEV_TOOLS=true to run.');
  process.exit(1);
}

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@naijascout.local';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMeNow!';
  const name = process.env.ADMIN_NAME || 'Administrator';

  const existing = await User.findByEmailOrUsername(email) || await User.findByEmailOrUsername(username);
  if (existing) {
    console.log('Admin already exists in local DB:', existing.email || existing.username);
    return;
  }

  const passwordHash = await User.hashPassword(password);
  const newUser = await User.create({ name, username, email, passwordHash, role: 'admin' });
  console.log('Created local admin user:', { id: newUser.id, email: newUser.email, username: newUser.username });
  console.log('IMPORTANT: change the default password and store credentials securely');
}

main().catch(e => { console.error(e); process.exit(1); });
