import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';
import session from 'express-session';
import { flash } from 'express-flash-message';
// eslint-disable-next-line import/extensions
import routes from './routes/routes.js';

dotenv.config();

const filename = fileURLToPath(import.meta.url);
const customDirname = dirname(filename);

const PORT = process.env.PORT ?? 3000;
const HOST = '0.0.0.0';
const oneDay = 1000 * 60 * 60 * 24;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(customDirname, '/views'));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  cookie: { maxAge: oneDay },
  saveUninitialized: true,
}));

app.use(flash({ sessionKeyName: 'flashMessage' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(customDirname, 'public')));

app.use(routes);

app.listen(PORT, HOST, () => {
  console.log(`Server has been started on port: ${PORT}`);
});
