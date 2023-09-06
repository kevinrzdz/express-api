import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';

const init = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: 'secretPassword',
  };

  passport.use(new Strategy(opts, (decoded, done) => done(null, decoded)));
};

const protectWithJwt = (req, res, next) => {
  if (req.path === '/auth/login') {
    return next();
  }
  return passport.authenticate('jwt', { session: false })(req, res, next);
};

export { init, protectWithJwt };
