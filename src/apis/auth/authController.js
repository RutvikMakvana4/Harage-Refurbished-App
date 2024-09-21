import authServices from "./authServices";

class authController {

    /**
     * @description: Send OTP to email
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async sendOtpToEmail(req, res) {
        const data = await authServices.sendOtpToEmail(req.body, res);
        return res.send({ message: "OTP send to your email address" })
    }


    /**
     * @description: Verify email OTP
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async emailVerifyOTP(req, res) {
        const data = await authServices.emailVerifyOTP(req.body, req, res);
        return res.send({ message: "OTP verification successfully" });
    }

    /**
     * @description: Send OTP to Phone Number
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async sendOtpToPhone(req, res) {
        const data = await authServices.sendOtpToPhone(req.body, req, res);
        return res.send({ message: "OTP send to your phone number" });
    }

    /**
     * @description : Verify phone OTP
     * @param {*} req
     * @param {*} res
     */
    static async phoneVerifyOTP(req, res) {
        const data = await authServices.phoneVerifyOTP(req.body, req, res);
        return res.send({ message: "OTP verify successfully" })
    }

    /**
     * @description : Users registration
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async register(req, res) {
        const data = await authServices.register(req.body, req, res);
        return res.send({ message: "User register successfully", data });
    }

    /**
     * @description : email verify
     * @param {*} req
     * @param {*} res
     */
    static async emailVerify(req, res) {
        const data = await authServices.emailVerify(req.query, req, res);
        return res.send({ message: "Email verification successfully" })
    }


    /**
     * @description: Login
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async login(req, res) {
        const data = await authServices.login(req.body, req, res);
        return res.send({ message: "Login successfully", data });
    }

    /**
     * @description: Logout user
     * @param {*} req 
     * @param {*} res 
     */
    static async logout(req, res) {
        await authServices.logout(req.body, req);
        return res.send({ message: "Logged out successfully" });
    }

    /**
     * @description: Forgot password link generate
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async forgotPassword(req, res) {
        await authServices.forgotPassword(req.body);
        return res.send({ message: "Reset password link has been sent to the email address" });
    }


    /**
     * @description: Forgot password page
     * @param {*} req 
     * @param {*} res 
     */
    static async forgotPage(req, res) {
        await authServices.forgotPage(req.params.token, req, res)
    }


    /**
     * @description: Reset password
     * @param {*} req 
     * @param {*} res 
     */
    static async resetPassword(req, res) {
        await authServices.resetPassword(req.params.token, req.body, req, res);
    }


    /**
     * @description: Change password
     * @param {*} req 
     * @param {*} res 
     */
    static async changePassword(req, res) {
        const data = await authServices.changePassword(req.body, req.user, req, res)
        return res.send({ message: "password change sucessfully", data });
    }

    /**
     * @description: Social login
     * @param {*} req 
     * @param {*} res 
     */
    static async socialLogin(req, res) {
        const data = await authServices.socialLogin(req.body, req, res)
        return res.send({ message: "Login successfully", data });
    }

    /**
     * @description : generate new Access token
     * @param {*} req
     * @param {*} res 
     */
    static async newAccessToken(req, res) {
        const data = await authServices.newAccessToken(req.body, req, res)
        return res.send({ data })
    }
}

export default authController;