import { listen } from './app';
import { port } from './config/env';
import connectDatabase from './config/database';
import { info, error } from './utils/logger';

async function startServer() {
  await connectDatabase();

  listen(port, () => {
    info(`Auth service listening on port ${port}`);
  });
}

startServer().catch(err => {
  error('Failed to start server', err);
  process.exit(1);
});
