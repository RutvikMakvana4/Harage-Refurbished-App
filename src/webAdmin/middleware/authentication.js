import { JWT } from "../../common/constants/constants";
import jwt from "jsonwebtoken";

export default (requiredRoles = []) => (req, res, next) => {
    if (req.session.token) {
        jwt.verify(req.session.token, JWT.SECRET, (err, decoded) => {
            if (err) {
                return res.redirect("/webAdmin/login");
            } else {
                const userRole = decoded.assignRoles

                const hasRequiredRole =  userRole.filter(element => !requiredRoles.includes(element));

                if (hasRequiredRole) {
                    req.user = decoded;
                    return next();
                } else {
                    return res.status(403).send("You have not access this page");
                }
            }
        });
    } else {
        return res.redirect("/webAdmin/login");
    }
};