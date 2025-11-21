import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import config from './config/env.js';
import moviesApiRoutes from './routes/api/movies.api.routes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'movies-service' });
});

app.use('/api/movies', moviesApiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
