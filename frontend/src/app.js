import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/env.js';
import authRoutes from './routes/web/auth.routes.js';
import indexWebRoutes from './routes/web/index.routes.js';
import moviesWebRoutes from './routes/web/movies.routes.js';
import attachUser from './middleware/attachUser.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import flash from './middleware/flash.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(attachUser);
app.use(flash);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'frontend', env: config.env });
});

app.use('/', authRoutes);
app.use('/', indexWebRoutes);
app.use('/', moviesWebRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
