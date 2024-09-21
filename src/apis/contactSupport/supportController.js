import supportServices from "./supportServices";

class supportController {
    /**
     * @description : contact support
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    static async contactSupport(req, res, next) {
        await supportServices.contactSupport(req.user, req.body, req, res);
        return res.send({ message: "message sent to Harage support team" })
    }
}

export default supportController;