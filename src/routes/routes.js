import express from 'express';
// eslint-disable-next-line import/extensions
import Clip from '../models/clip.js';

const routes = express.Router();

routes.get('/home', async (req, res) => {
  const clips = await Clip.find({});

  res.render('index', { clips });
});

routes.get('/login', async (req, res) => {
  res.render('login');
});

routes.get('/', async (req, res) => {
  res.redirect(303, '/home');
});

routes.post('/new-clip', (req, res) => {
  const { name, email, 'clip-url': clipUrl } = req.body;
  const newClip = new Clip({ name, email, clipUrl });

  newClip.save((err) => {
    if (err) return console.log(err);

    return console.log('Sucess');
  });

  res.redirect(303, '/');
});

export default routes;
