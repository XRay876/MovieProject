import { connect } from 'mongoose';
import config from './env.js';
import logger from '../utils/logger.js';

const { mongoUri } = config;

async function connectDatabase() {
  try {
    await connect(mongoUri, {
      autoIndex: true
    });
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

export default connectDatabase;
