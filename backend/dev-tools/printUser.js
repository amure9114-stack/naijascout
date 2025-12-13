import db from '../database.js';

const email = process.env.EMAIL || 'admin@naijascout.local';

try {
  const row = db.prepare('SELECT id, name, username, email, passwordHash, role, created_at FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?) LIMIT 1').get(email, email);
  if (!row) {
    console.log('User not found for', email);
    process.exit(0);
  }
  console.log('USER:', {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    role: row.role,
    passwordHash: row.passwordHash ? row.passwordHash.substring(0, 10) + '...' : null,
    created_at: row.created_at
  });
} catch (e) {
  console.error('Error reading DB:', e);
  process.exit(1);
}
