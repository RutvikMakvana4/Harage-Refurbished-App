import FcmStore from "../../../model/fcmToken";
import commonService from "../../../utils/commonService";
import FcmHelper from "../../common/fcmHelper";

class fcmServices {

    /**
     * @description : Register FCM Token
     * @param {*} auth
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async fcmRegister(auth, data, req, res) {
        const { deviceId, token, deviceType } = data;

        const fcmToken = await FcmStore.findOne({ userId: auth, deviceId: deviceId });

        if (!fcmToken) {
            return await FcmStore.create({
                userId: auth,
                token: token,
                deviceId: deviceId,
                deviceType: deviceType
            });
        }

        return await FcmStore.findOneAndUpdate(
            { userId: auth, deviceId: deviceId },
            {
                token: token,
                deviceId: deviceId,
            }
        );
    }


    /**
     * @description : Testing (send notification)
     * @param {*} auth
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async sendPush(data, req, res) {
        const { token, title, message, deviceId } = data;
        const tokens = [token];

        const payload = {
            notification: {
                title: title,
                body: message,
            }
        };

        await FcmHelper.sendPushNotification(tokens, payload);
    }
}

export default fcmServices;