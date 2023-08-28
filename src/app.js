import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import authConfig from './auth.js';
import authRoutes from './routers/auth.js';

authConfig(passport);

const app = express();
app.use(bodyParser.json());

app.get('/', passport.authenticate('jwt', { session: false }), (_req, res) => {
  res.send('hello world');
});

app.use('/auth', authRoutes);

export default app;
