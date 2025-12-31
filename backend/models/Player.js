import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  // Link player profile to the authenticated user for /me lookups
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    unique: false // allow multiple until migration; we enforce per-user in code
  },

  // Identity
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  firstName: { type: String, trim: true, maxlength: 50 },
  lastName: { type: String, trim: true, maxlength: 50 },
  dateOfBirth: { type: Date },
  age: { type: Number, min: 10, max: 60 },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true, maxlength: 30 },
  nationality: {
    type: String,
    default: 'Nigerian'
  },

  // Football details
  position: {
    type: String,
    lowercase: true,
    enum: ['forward', 'midfielder', 'defender', 'goalkeeper', 'striker'],
    default: 'forward'
  },
  jerseyNumber: { type: Number, min: 0, max: 99 },
  preferredFoot: { type: String, enum: ['left', 'right', 'both'], lowercase: true },
  club: {
    type: String,
    trim: true
  },
  bio: { type: String, maxlength: 1000 },
  story: { type: String, maxlength: 1500 },
  profilePicture: { type: String },
  highlightsLink: { type: String },

  // Physical + performance
  height: { type: Number, min: 100, max: 250 },
  weight: { type: Number, min: 30, max: 200 },
  overallRating: { type: Number, min: 0, max: 99 },
  potential: { type: Number, min: 0, max: 99 },

  engagement: {
    goals: {
      type: Number,
      default: 0,
      min: 0
    },
    assists: {
      type: Number,
      default: 0,
      min: 0
    },
    interactions: {
      type: Number,
      default: 0,
      min: 0
    },
    matches: {
      type: Number,
      default: 0,
      min: 0
    },
    minutes: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  stats: {
    pace: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    shooting: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    passing: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    dribbling: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    defending: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    physical: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    }
  },
  scoutPoints: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'scouted', 'signed'],
    default: 'active'
  },
  image: {
    type: String,
    default: '/avatar-icon.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate scout points before saving
playerSchema.pre('save', function (next) {
  this.scoutPoints = this.engagement.goals +
    (this.engagement.assists * 2) +
    this.engagement.interactions;
  next();
});

// Virtual for overall rating
// If you prefer a computed rating instead of explicit field, add a differently named virtual
// playerSchema.virtual('computedOverall').get(function() {
//   const s = this.stats || {};
//   const vals = [s.pace, s.shooting, s.passing, s.dribbling, s.defending, s.physical].filter(v => typeof v === 'number');
//   if (!vals.length) return undefined;
//   return Math.round(vals.reduce((a,b)=>a+b,0) / vals.length);
// });

// Ensure virtual fields are serialized
playerSchema.set('toJSON', { virtuals: true });
playerSchema.set('toObject', { virtuals: true });

const Player = mongoose.model('Player', playerSchema);

export default Player;

