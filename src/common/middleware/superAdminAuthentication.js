import passport from "passport";

const superAdminAuthentication = async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        console.log(user.isSuperAdmin)
        if (!user || !user.isSuperAdmin === true) {
            return res.status(401).send({ message: "Unauthorized for Super Admin" });
        }
        req.user = user;
        return next();
    })(req, res, next);
};

export default superAdminAuthentication;