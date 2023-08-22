import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import authConfig from './auth.js';
import { registerUser, checkUserCredentials } from './controllers/users.js';

await registerUser('kevin', '1234');

authConfig(passport);

const app = express();
app.use(bodyParser.json());

app.get('/', passport.authenticate('jwt', { session: false }), (_req, res) => {
  res.send('hello world');
});

app.post('/login', async (req, res) => {
  if (!req.body.user || !req.body.password) {
    return res.status(400).json({ message: 'Missing data' });
  }

  const validCredentials = await checkUserCredentials(req.body.user, req.body.password);

  if (!validCredentials) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: req.body.user }, 'secretPassword');

  return res.status(200).json({ token });
});

export default app;
