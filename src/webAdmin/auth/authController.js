import asyncWrap from "express-async-wrapper";
import authServices from "./authServices";

class authController {
  /**
   * @description: Login page load
   * @param {*} req
   * @param {*} res
   */
  static async index(req, res) {
    await authServices.index(req, res);
  }

  /**
   * @description: Login with email
   * @param {*} req
   * @param {*} res
   */
  static async login(req, res) {
    await authServices.login(req.body, req, res);
  }

  /**
   * @description : Logout admin
   * @param {*} req
   * @param {*} res
   */
  static async logout(req, res) {
    delete req.session.token;
    return res.redirect("/webAdmin/login");
  }

  /**
   * Otp verification
   * @param {*} req
   * @param {*} res
   */
  static async otpVerification(req, res) {
    await authServices.otpVerification(req, res);
  }

  /**
   * Resend Otp
   * @param {*} req
   * @param {*} res
   */
  static async resendOtp(req, res) {
    await authServices.resendOtp(req, res);
  }

  /**
   * @description : Change Password Page
   * @param {*} req
   * @param {*} res
   */
  static async changePasswordPage(req, res) {
    await authServices.changePasswordPage(req, res);
  }

  /**
   * @description : Change Password
   * @param {*} req
   * @param {*} res
   */
  static async changePassword(req, res) {
    const data = await authServices.changePassword(req.body, req, res);
  }
}

export default authController;
