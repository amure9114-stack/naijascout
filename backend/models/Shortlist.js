import mongoose from 'mongoose';

const shortlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Shortlist = mongoose.model('Shortlist', shortlistSchema);

export default Shortlist;
