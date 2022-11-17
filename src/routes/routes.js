import express from 'express';
// eslint-disable-next-line import/extensions
import { Clip, User } from '../models/models.js';

const routes = express.Router();

routes.get('/home', async (req, res) => {
  if (req.session.loggedin) {
    const clips = await Clip.find({});

    res.render('index', { clips });
  } else {
    res.redirect(303, '/login');
  }
});

routes.get('/login', async (req, res) => {
  res.render('login');
});

routes.get('/', async (req, res) => {
  if (req.session.loggedin) {
    res.redirect(303, '/home');
  } else {
    res.redirect(303, '/login');
  }
});

routes.post('/auth', async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  if (username && password) {
    await User.findOne({ username }, 'password', (err, doc) => {
      if (err || doc.password !== password) {
        res.redirect('/login');
        return console.error(err);
      }

      req.session.loggedin = true;

      return res.redirect('/home');
    }).clone().catch((err) => { console.log(err); });
  }
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
