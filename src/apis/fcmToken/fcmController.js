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

    /**
     * @description : Testing Push notification
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async sendPush(req, res) {
        await fcmServices.sendPush(req.body, req, res);
        return res.send({ message: "Notification send successfully" });
    }
}

export default fcmController;