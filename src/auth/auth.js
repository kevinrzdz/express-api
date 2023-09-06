import { Strategy, ExtractJwt } from 'passport-jwt';

export default (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: 'secretPassword',
  };

  passport.use(new Strategy(opts, (decoded, done) => done(null, decoded)));
};
