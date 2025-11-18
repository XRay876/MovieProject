import express, { json } from 'express';
import cors from 'cors';
import { cors as _cors } from './config/env';
import authRoutes from './routes/auth.routes';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';

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
