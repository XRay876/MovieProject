import express, { json } from 'express';
import cors from 'cors';
import config from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const { cors: _cors } = config;

const app = express();

app.use(cors({
  origin: _cors.origin,
  credentials: true
}));
app.use(json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
