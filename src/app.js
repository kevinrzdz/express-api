import express from 'express';
import authRoutes from './auth/auth-router.js';
import setUpMiddlewares from './tools/middlewares.js';

const app = express();

const PORT = process.env.PORT ?? 0;

setUpMiddlewares(app);

app.get('/', (_req, res) => {
  res.send('hello world');
});

app.use('/auth', authRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export { app, server };
