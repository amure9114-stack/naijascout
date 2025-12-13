// backend/database.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'naijascout.db'));

// Better performance & safety
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// FIXED: Renamed createdAt/updatedAt → created_at / updated_at (safe names)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player' CHECK(role IN ('player', 'scout', 'admin', 'moderator')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shortlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scout_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(scout_id, player_id),
  FOREIGN KEY(scout_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shortlist_scout ON shortlist(scout_id);

  CREATE INDEX IF NOT EXISTS idx_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_username ON users(username);
`);



console.log('SQLite database ready → naijascout.db');

export default db;