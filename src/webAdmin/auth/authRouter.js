import express from "express";
import asyncWrap from "express-async-wrapper";
import authController from "./authController";
import authentication from "../../webAdmin/middleware/authentication";

const routes = express.Router();

routes.get("/login", asyncWrap(authController.index));
routes.post("/login", asyncWrap(authController.login));
routes.get("/logout", asyncWrap(authController.logout));

routes.post("/otp-verification", asyncWrap(authController.otpVerification));

routes.post("/resend-otp", asyncWrap(authController.resendOtp));

routes.get(
  "/change-password",
  authentication(["Admin"]),
  asyncWrap(authController.changePasswordPage)
);
routes.post(
  "/change-password",
  authentication(["Admin"]),
  asyncWrap(authController.changePassword)
);

module.exports = routes;
