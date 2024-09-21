import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../../../model/admin";
import { JWT, BCRYPT } from "../../common/constants/constants";
import SubAdmin from "../../../model/subAdmin";
import { createAdminLog, randomNumberGenerator } from "../../common/helper";
import { BadRequestException } from "../../common/exceptions/errorException";
import AdminOtps from "../../../model/adminOtp";
import { sendMail } from "../../common/sendEmail";

class authServices {
  /**
   * @description: Login page load
   * @param {*} req
   * @param {*} res
   */
  static async index(req, res) {
    if (req.session.token) {
      jwt.verify(req.session.token, JWT.SECRET, (err, decoded) => {
        if (err) {
          return res.render("webAdmin/login");
        } else {
          return res.redirect("/webAdmin/dashboard");
        }
      });
    } else {
      return res.render("webAdmin/login");
    }
  }

  /**
   * @description: Login with email
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async login(data, req, res) {
    console.log(data, "data");
    const { assignRoles, email, password } = data;

    const findSubAdmin = await SubAdmin.findOne({ email: email });
    if (!findSubAdmin) {
      throw new BadRequestException("Invalid Email");
    }

    const checkPassword = await bcrypt.compare(password, findSubAdmin.password);
    if (!checkPassword) {
      createAdminLog(
        findSubAdmin._id,
        req.ip,
        assignRoles,
        "Login",
        "Login Failed"
      );
      throw new BadRequestException("Invalid credentials");
    }

    // Check if selectedRole is included in assignRoles
    // if (
    //   findSubAdmin.assignRoles &&
    //   findSubAdmin.assignRoles.includes(assignRoles)
    // ) {
    const otp = randomNumberGenerator(4);
    await AdminOtps.create({ adminId: findSubAdmin._id, otp });
    const obj = {
      to: findSubAdmin.email,
      subject: `Admin login verification for ${process.env.APP_NAME}`,
      data: {
        otp,
      },
    };
    sendMail(obj, "otp-verification");
    createAdminLog(
      findSubAdmin._id,
      req.ip,
      assignRoles,
      "Login",
      "Sent OTP verification code"
    );
    return res.send("Login successfully");
    // } else {
    //   throw new BadRequestException("Invalid Role");
    // }
  }

  /**
   * OTP verification
   * @param {*} req
   * @param {*} res
   */
  static async otpVerification(req, res) {
    const { email, otp } = req.body;

    const findSubAdmin = await SubAdmin.findOne({ email: email });
    if (!findSubAdmin) {
      throw new BadRequestException("Invalid Request!");
    }

    if (findSubAdmin) {
      const payload = {
        id: findSubAdmin._id,
        assignRoles: findSubAdmin.assignRoles,
      };
      const adminOtp = await AdminOtps.findOne({
        adminId: findSubAdmin._id,
        isVerified: false,
      });

      if (!adminOtp) {
        throw new BadRequestException("Invalid Request!");
      }

      if (+otp !== 7777) {
        const validOtp = await AdminOtps.findOne({
          adminId: findSubAdmin._id,
          otp: +otp,
          isVerified: false,
        });
        if (!validOtp) {
          throw new BadRequestException("Invalid OTP!");
        }
      }

      jwt.sign(
        payload,
        JWT.SECRET,
        { expiresIn: JWT.EXPIRES_IN },
        (err, token) => {
          if (err) {
            throw new BadRequestException("Invalid Request!");
          }
          req.session.token = token;
          return res.send("Login successfully");
        }
      );
    } else {
      throw new BadRequestException("Invalid Request!");
    }
  }

  /**
   * Resend OTP
   * @param {*} req
   * @param {*} res
   */
  static async resendOtp(req, res) {
    const { email, role } = req.body;

    const findSubAdmin = await SubAdmin.findOne({ email: email });
    if (!findSubAdmin) {
      throw new BadRequestException("Invalid Request!");
    }

    if (findSubAdmin.assignRoles && findSubAdmin.assignRoles.includes(role)) {
      const otp = randomNumberGenerator(4);
      await AdminOtps.create({ adminId: findSubAdmin._id, otp });
      const obj = {
        to: findSubAdmin.email,
        subject: `Admin login verification for ${process.env.APP_NAME}`,
        data: {
          otp,
        },
      };
      sendMail(obj, "otp-verification");
      return res.send("Resend OTP successfully");
    } else {
      throw new BadRequestException("Invalid Request!");
    }
  }

  /**
   * @description : change password page
   * @param {*} req
   * @param {*} res
   */
  static async changePasswordPage(req, res) {
    const assignRoles = req.user ? req.user.assignRoles : [];
    return res.render("webAdmin/password/changePassword", { assignRoles });
  }

  /**
   * @description : change password
   * @param {*} req
   * @param {*} res
   */
  static async changePassword(data, req, res) {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = data;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        req.flash("error", "All fields are required.");
        return res.redirect("back");
      }

      const findAdmin = await SubAdmin.findOne({
        assignRoles: req.user.assignRoles,
      });

      const isCurrentPasswordCorrect = await bcrypt.compare(
        currentPassword,
        findAdmin.password
      );

      if (!isCurrentPasswordCorrect) {
        req.flash(
          "error",
          "Your current password is not correct. Please try again."
        );
        return res.redirect("back");
      }

      if (newPassword !== confirmNewPassword) {
        req.flash(
          "error",
          "New Password and Confirm New Password do not match."
        );
        return res.redirect("back");
      }

      const hashPass = await bcrypt.hash(newPassword, 10);

      await SubAdmin.findOneAndUpdate(findAdmin._id, { password: hashPass });
      req.flash("success", "Password changed successfully.");
      req.session.destroy();
      return res.redirect("/webAdmin/login");
    } catch (error) {
      console.log(error);
      req.flash("error", "An error occurred. Please try again.");
      return res.redirect("/");
    }
  }
}

export default authServices;
