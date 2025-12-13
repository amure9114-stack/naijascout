import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../dev.db');

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create Player table
db.exec(`
  CREATE TABLE IF NOT EXISTS Player (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    position TEXT NOT NULL,
    club TEXT NOT NULL,
    age INTEGER NOT NULL,
    nationality TEXT NOT NULL,
    overallRating INTEGER NOT NULL,
    potential INTEGER NOT NULL,
    profilePicture TEXT,
    marketValue REAL NOT NULL DEFAULT 0.0,
    demandScore INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create Scout table
db.exec(`
  CREATE TABLE IF NOT EXISTS Scout (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    club TEXT,
    role TEXT DEFAULT 'Scout',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create Match table
db.exec(`
  CREATE TABLE IF NOT EXISTS Match (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerId INTEGER NOT NULL,
    opponent TEXT NOT NULL,
    date DATETIME NOT NULL,
    rating REAL NOT NULL,
    goals INTEGER NOT NULL,
    assists INTEGER NOT NULL,
    result TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playerId) REFERENCES Player(id) ON DELETE CASCADE
  )
`);

// Create Shortlist table
db.exec(`
  CREATE TABLE IF NOT EXISTS Shortlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scoutId INTEGER NOT NULL,
    playerId INTEGER NOT NULL,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scoutId, playerId),
    FOREIGN KEY (scoutId) REFERENCES Scout(id) ON DELETE CASCADE,
    FOREIGN KEY (playerId) REFERENCES Player(id) ON DELETE CASCADE
  )
`);

// Insert test player data
const insertPlayer = db.prepare(`
  INSERT OR IGNORE INTO Player (username, firstName, lastName, position, club, age, nationality, overallRating, potential, profilePicture, marketValue, demandScore)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const testPlayers = [
  ['big-blvck', 'Emmanuel', 'Blacko', 'Forward', 'Ajax', 22, 'Nigeria', 82, 88, 'https://via.placeholder.com/150', 5000000, 95],
  ['haaland', 'Erling', 'Haaland', 'Forward', 'Manchester City', 24, 'Norway', 91, 95, 'https://via.placeholder.com/150', 100000000, 99],
  ['vinicius_jr', 'Vinicius', 'Junior', 'Forward', 'Real Madrid', 24, 'Brazil', 89, 94, 'https://via.placeholder.com/150', 80000000, 98],
];

testPlayers.forEach(player => {
  insertPlayer.run(...player);
});

// Insert test scout data
const insertScout = db.prepare(`
  INSERT OR IGNORE INTO Scout (name, email, password, club, role)
  VALUES (?, ?, ?, ?, ?)
`);

const testScouts = [
  ['John Smith', 'john@realmadrind.com', 'hashed_password_1', 'Real Madrid', 'Scout'],
  ['Jane Doe', 'jane@manchestercity.com', 'hashed_password_2', 'Manchester City', 'Scout'],
];

testScouts.forEach(scout => {
  insertScout.run(...scout);
});

// Insert sample trials
const insertTrial = db.prepare(`
  INSERT OR IGNORE INTO Trials (title, location, ageGroup, time, description, date)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const testTrials = [
  ['U-17 Open Trials', 'Teslim Balogun Stadium, Lagos', 'U-17', '09:00', 'Open trials for talented players aged 15-17', new Date(2024, 11, 15).toISOString()],
  ['Goalkeeper Assessment', 'National Stadium, Abuja', 'U-20', '14:00', 'Specialized goalkeeper trials', new Date(2024, 11, 15).toISOString()],
  ['Elite Youth Camp', 'Godswill Akpabio Stadium', 'U-15', '10:00', 'Week-long elite training camp with trials', new Date(2024, 11, 20).toISOString()],
  ['Regional Scouting Day', 'Ahmadu Bello Stadium, Kaduna', 'U-19', '08:00', 'Northern region scouting event', new Date(2024, 11, 22).toISOString()]
];

testTrials.forEach(t => insertTrial.run(...t));

console.log('✅ Database seeded successfully!');
console.log(`📁 Database location: ${dbPath}`);

db.close();
