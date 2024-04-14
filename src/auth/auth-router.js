import express from 'express';
import login from './auth.http.js';

const router = express.Router();

router.route('/login')
  .post(login);

export default router;
