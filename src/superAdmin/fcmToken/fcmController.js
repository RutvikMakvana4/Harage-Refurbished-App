import fcmServices from "./fcmServices";

class fcmController {

    /**
     * @description : Register FCM Token
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async fcmRegister(req, res) {
        await fcmServices.fcmRegister(req.user, req.body, req, res);
        return res.send({ message: "Success" });
    }
}

export default fcmController;