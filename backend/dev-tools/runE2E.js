import 'dotenv/config';

// Guard this script: only in development or when explicitly allowed
if (process.env.NODE_ENV !== 'development' && process.env.ALLOW_DEV_TOOLS !== 'true') {
  console.error('runE2E.js is for development only. Set NODE_ENV=development or ALLOW_DEV_TOOLS=true to run.');
  process.exit(1);
}

const API_URL = process.env.API_URL || 'http://localhost:5000';
const username = process.env.E2E_USERNAME || process.env.ADMIN_EMAIL || 'admin@naijascout.local';
const password = process.env.E2E_PASSWORD || process.env.ADMIN_PASSWORD || 'ChangeMeNow!';

async function http(path, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, opts);
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch (e) { body = text; }
  return { status: res.status, ok: res.ok, body };
}

async function main() {
  console.log('E2E: starting against', API_URL);

  // Login
  const login = await http('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role: 'scout' })
  });

  if (!login.ok) {
    console.error('Login failed', login.status, login.body);
    process.exit(1);
  }

  console.log('Login success:', login.body.user?.username || login.body.user?.email);
  const token = login.body.token;

  // Fetch /api/auth/me
  const me = await http('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  console.log('/api/auth/me →', me.status, me.body);

  // Update current player (settings)
  const update = await http('/api/players/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ club: 'E2E Club', age: 30 })
  });

  console.log('PUT /api/players/me →', update.status, update.body);

  if (update.ok) {
    console.log('E2E: Player update successful');
    process.exit(0);
  } else {
    console.error('E2E: Player update failed');
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
