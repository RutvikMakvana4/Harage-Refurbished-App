import passport from "passport";

const guestUserAuthentication = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (user) {
      req.user = user;
      req.isAuthenticated = true;
    } else {
      req.isAuthenticated = false;
    }
    next();
  })(req, res, next);
};

export default guestUserAuthentication;
