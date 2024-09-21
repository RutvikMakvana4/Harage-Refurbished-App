import express from "express";
import authentication from "../../src/common/middleware/authentication";
const routes = express.Router();

routes.use('/auth', require("../../src/superAdmin/auth/authRouter"));
routes.use('/quick-sell', require("../../src/superAdmin/sellItems/sellItemRouter"));
routes.use('/members', require("../../src/superAdmin/member/memberRouter"));

routes.use('/super-check-version', require("../../src/appVersion/versionRoute"));

routes.use('/fcm', require('../../src/superAdmin/fcmToken/fcmRouter'));

routes.use('/admin-notification', authentication, require('../../src/superAdmin/notification/notificationRouter'));

module.exports = routes;