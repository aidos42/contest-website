import express from 'express';
// eslint-disable-next-line import/extensions
import { Clip, User } from '../models/models.js';

const REGEXP_YOUTUBE_URL = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
// eslint-disable-next-line no-useless-escape
const REGEXP_YOUTUBE_VIDEO_ID = /^(?:(?:https|http):\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be).*(?<=\/|v\/|u\/|embed\/|shorts\/|watch\?v=)(?<!\/user\/)(?<id>[\w\-]{11})(?=\?|&|$)/;

const routes = express.Router();

routes.get('/home', async (req, res) => {
  if (req.session.loggedin) {
    const clips = await Clip.find({});
    const errorMessages = await req.consumeFlash('error');
    const infoMessages = await req.consumeFlash('info');

    res.render('index', { clips, errorMessages, infoMessages });
  } else {
    res.redirect(303, '/login');
  }
});

routes.get('/login', async (req, res) => {
  const messages = await req.consumeFlash('error');

  res.render('login', { messages });
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
    await User.findOne({ username }, 'password', async (err, doc) => {
      if (err || doc.password !== password) {
        await req.flash('error', 'Введён неправильный пароль');

        return res.redirect('/login');
      }

      req.session.loggedin = true;

      return res.redirect('/home');
    }).clone().catch((err) => { console.log(err); });
  }
});

routes.post('/new-clip', async (req, res) => {
  const { name, email, 'clip-url': rawClipUrl } = req.body;

  if (!email.includes('unistream')) {
    await req.flash('error', 'В заявке должна быть рабочая почта с доменом unistream');

    return res.redirect(303, '/');
  }

  if (REGEXP_YOUTUBE_URL.test(rawClipUrl)) {
    const clipUrl = `https://www.youtube.com/embed/${rawClipUrl.match(REGEXP_YOUTUBE_VIDEO_ID).groups.id}`;

    const newClip = new Clip({ name, email, clipUrl });

    newClip.save((err) => {
      if (err) return console.log(err);

      return console.log('Sucess');
    });

    await req.flash('info', 'Заявка принята');

    return res.redirect(303, '/');
  } else {
    await req.flash('error', 'Подходят только ссылки на Youtube');

    return res.redirect(303, '/');
  }
});

export default routes;
