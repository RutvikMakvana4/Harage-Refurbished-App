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
        const { deviceId, token, deviceType, userType } = data;

        const fcmToken = await FcmStore.findOne({ userId: auth, deviceId: deviceId });

        if (!fcmToken) {
            return await FcmStore.create({
                userId: auth,
                token: token,
                deviceId: deviceId,
                deviceType: deviceType,
                userType: userType
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

}

export default fcmServices;