import express from "express";
import asyncWrap from "express-async-wrapper";
import authController from "./authController";

const routes = express.Router();
import authentication from "../../common/middleware/authentication";
import validator from "../../common/config/joiValidation";
import { registerDto, otpSendToEmail, emailVerifyOtpDto, sendOtpToPhoneDto, phoneVerifyOtpDto } from "./dtos/registerDto";
import { loginDto } from "./dtos/loginDto"

routes.post('/send-otp-email', validator.body(otpSendToEmail), asyncWrap(authController.sendOtpToEmail));
routes.post('/emailVerifyOTP', validator.body(emailVerifyOtpDto), asyncWrap(authController.emailVerifyOTP));

routes.post('/send-otp-phone', validator.body(sendOtpToPhoneDto), asyncWrap(authController.sendOtpToPhone));
routes.post('/phoneVerifyOTP', validator.body(phoneVerifyOtpDto), asyncWrap(authController.phoneVerifyOTP));

routes.get('/emailVerify', asyncWrap(authController.emailVerify));

routes.post('/register', validator.body(registerDto), asyncWrap(authController.register));
routes.post('/login', validator.body(loginDto), asyncWrap(authController.login));
routes.post('/logout', authentication, asyncWrap(authController.logout));

routes.post('/forgot-password', asyncWrap(authController.forgotPassword));
routes.get('/forgotPage/:token', asyncWrap(authController.forgotPage));
routes.post('/forgotPage/:token', asyncWrap(authController.resetPassword));

routes.post('/change-password', authentication, asyncWrap(authController.changePassword));

routes.post('/social-login', asyncWrap(authController.socialLogin));

routes.post('/refresh-token', asyncWrap(authController.newAccessToken));

module.exports = routes;