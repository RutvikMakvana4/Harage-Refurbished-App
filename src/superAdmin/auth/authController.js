import authService from "./authServices";

class authController {

    /**
    * @description: super admin login
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    static async login(req, res) {
        const data = await authService.login(req.body, req, res);
        return res.send(data)
    }

}

export default authController;

