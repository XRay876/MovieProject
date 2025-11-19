import mongoose from 'mongoose';
import config from './env.js';
import logger from '../utils/logger.js';

async function connectDatabase() {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: true
    });
    logger.info('Connected to MongoDB (movies-service)');
  } catch (err) {
    logger.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

export default connectDatabase;
