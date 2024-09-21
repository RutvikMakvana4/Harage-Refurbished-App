import ContactSupport from "../../../model/contactSupport";
import commonService from "../../../utils/commonService";
import { BadRequestException } from "../../common/exceptions/errorException";
import { sendMail } from "../../common/sendEmail";
import Users from "../../../model/users";

class supportServices {
    /**
     * @description : contact support
     * @param {*} auth 
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     */
    static async contactSupport(auth, data, req, res) {
        try {
            const { name, email, message } = data
            const user = await commonService.findOne(Users, { _id: auth });
            const contactSupportStore = await commonService.createOne(ContactSupport, {
                userId: auth,
                name: name,
                email: email,
                message: message,
            });
            const obj = {
                to: process.env.RECEIVE_EMAIL,
                subject: `Contact support ${process.env.APP_NAME}`,
                data: { contactSupportStore, user }
            }

            sendMail(obj, 'contactSupport');
        } catch (err) {
            return res.status(400).send({ message: "Message not sent" })
        }
    }
}

export default supportServices;