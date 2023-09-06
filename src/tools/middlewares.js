import bodyParser from 'body-parser';
import { init, protectWithJwt } from '../auth/auth-middlewares.js';

const setUpMiddlewares = (app) => {
  app.use(bodyParser.json());
  init();
  app.use(protectWithJwt);
};

export default setUpMiddlewares;
