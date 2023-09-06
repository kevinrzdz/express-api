import jwt from 'jsonwebtoken';
import { checkUserCredentials } from './users.js';

const SECRET = process.env.JWT_SECRET || 'secretPassword';

const login = async (req, res, next) => {
  try {
    if (!req.body.user || !req.body.password) {
      return res.status(400)
        .json({ message: 'Missing data' });
    }

    const validCredentials = await checkUserCredentials(req.body.user, req.body.password);

    if (!validCredentials) {
      return res.status(401)
        .json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: req.body.user }, SECRET);

    return res.status(200)
      .json({ token });
  } catch (error) {
    next(error);
    return undefined;
  }
};

export default login;
