import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/naijascout';
    if (!mongoUri) {
      throw new Error('Missing MONGODB_URI/MONGO_URI environment variable');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // In development allow the app to continue even if MongoDB is not available.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('Continuing without MongoDB in non-production environment. Some features may be disabled.');
    }
  }
};

export default connectDB;

