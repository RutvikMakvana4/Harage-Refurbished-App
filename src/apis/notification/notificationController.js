import NotificationHistoryResource from "./resources/notificationHistoryResources";
import notificationServices from "./notificationServices";


class notificationController {
    /**
     * @description: Notification history
     * @param {*} req 
     * @param {*} res 
     */
    static async notificationHistory(req, res) {
        const { data, meta } = await notificationServices.notificationHistory(req.user, req.query);
        return res.send({ data: new NotificationHistoryResource(data), meta: meta });
    }



    /**
     * @description: Un read notification count
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async unReadNotificationCount(req, res) {
        const data = await notificationServices.unReadNotificationCount(req.user, req, res);
        return res.send({ data: data });
    }



    /**
     * @description: Notification read at
     * @param {*} req 
     * @param {*} res 
     */
    static async notificationReadAt(req, res) {
        await notificationServices.notificationReadAt(req.user, req, res);
        return res.send({ message: "Notification read successfully" })
    }
}

export default notificationController;