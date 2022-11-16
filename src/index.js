import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';
// eslint-disable-next-line import/extensions
import Clip from './models/clip.js';

const filename = fileURLToPath(import.meta.url);
const customDirname = dirname(filename);

const PORT = process.env.port ?? 4242;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(customDirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(customDirname, 'public')));

app.get('/', async (req, res) => {
  const clips = await Clip.find({});
  console.log(clips);

  res.render('index');
});

app.post('/new-clip', (req, res) => {
  const { name, email, 'clip-url': clipUrl } = req.body;
  const newClip = new Clip({ name, email, clipUrl });

  newClip.save((err) => {
    if (err) return console.log(err);

    return console.log('Sucess');
  });

  res.redirect(303, '/');
});

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`);
});
