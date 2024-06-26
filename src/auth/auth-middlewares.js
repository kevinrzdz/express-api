import { ExtractJwt, Strategy } from 'passport-jwt'
import passport from 'passport'

const init = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: 'secretPassword'
  }

  passport.use(new Strategy(opts, (decoded, done) => done(null, decoded)))
}

const protectWithJwt = (req, res, next) => {
  if (req.path === '/login') {
    return next()
  }
  return passport.authenticate('jwt', { session: false })(req, res, next)
}

export { init, protectWithJwt }
