import app from './app.js';
import config from './config/env.js';
import connectDatabase from './config/database.js';
import logger from './utils/logger.js';

async function startServer() {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(`Movies service listening on port ${config.port}`);
  });
}

startServer().catch(err => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
