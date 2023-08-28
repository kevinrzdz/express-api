import express from 'express';
import jwt from 'jsonwebtoken';
import { checkUserCredentials, registerUser } from '../controllers/users.js';

const router = express.Router();
await registerUser('kevin', '1234');

router.route('/')
  .get((_req, res) => res.send('GET Auth router'))
  .post((_req, res) => res.send('POST Auth router'));

router.route('/login')
  .post(async (req, res) => {
    if (!req.body.user || !req.body.password) {
      return res.status(400)
        .json({ message: 'Missing data' });
    }

    const validCredentials = await checkUserCredentials(req.body.user, req.body.password);

    if (!validCredentials) {
      return res.status(401)
        .json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: req.body.user }, 'secretPassword');

    return res.status(200)
      .json({ token });
  });

export default router;
