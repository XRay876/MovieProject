import app from './app.js';
import connectDatabase from './config/database.js';
import config from './config/env.js';
import logger from './utils/logger.js';

async function startServer() {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(`Auth service listening on port ${config.port}`);
  });
}

startServer().catch(err => {
  logger.error('Failed to start server', err);
  process.exit(1);
});