import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';
// eslint-disable-next-line import/extensions
import routes from './routes/routes.js';

const filename = fileURLToPath(import.meta.url);
const customDirname = dirname(filename);

const PORT = process.env.port ?? 4242;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(customDirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(customDirname, 'public')));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`);
});
