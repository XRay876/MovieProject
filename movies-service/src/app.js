import express from 'express';
import cors from 'cors';
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/env.js';
import indexWebRoutes from './routes/web/index.routes.js';
import moviesWebRoutes from './routes/web/movies.routes.js';
import moviesApiRoutes from './routes/api/movies.api.routes.js';
import attachUser from './middleware/attachUser.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(attachUser);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'movies-service' });
});

app.use('/', indexWebRoutes);
app.use('/', moviesWebRoutes);

app.use('/api/movies', moviesApiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
