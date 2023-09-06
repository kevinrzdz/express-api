import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import authConfig from './auth/auth.js';
import authRoutes from './auth/auth-router.js';

authConfig(passport);

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT ?? 0;

app.get('/', passport.authenticate('jwt', { session: false }), (_req, res) => {
  res.send('hello world');
});

app.use('/auth', authRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export { app, server };
