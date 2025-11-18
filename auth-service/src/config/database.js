import { connect } from 'mongoose';
import { mongoUri } from './env';
import { info, error } from '../utils/logger';

async function connectDatabase() {
  try {
    await connect(mongoUri, {
      autoIndex: true
    });
    info('Connected to MongoDB');
  } catch (err) {
    error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

export default connectDatabase;
