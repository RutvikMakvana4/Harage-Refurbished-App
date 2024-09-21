import mongoose from "mongoose";
import Notification from "../../../model/notifications";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";


class notificationServices {
    /**
     * @description: Notification history
     * @param {*} auth 
     * @param {*} query 
     * @returns 
     */
    static async notificationHistory(auth, query) {
        const page = parseInt(query.page) - 1 || 0;
        const pageLimit = parseInt(query.limit) || 20;

        const totalDocument = await Notification.countDocuments({ superAdminId: auth });
        const findNotification = await Notification.find({ superAdminId: auth })
          .skip(page * pageLimit)
          .limit(pageLimit)
          .sort({ createdAt: -1 });

        const meta = {
            total: totalDocument,
            perPage: pageLimit,
            currentPage: page + 1,
            lastPage: Math.ceil(totalDocument / pageLimit),
        }

        return { data: findNotification, meta }
    }




    /**
     * @description: Notification count
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async unReadNotificationCount(auth, req, res) {
        const totalDocument = await Notification.countDocuments({
          superAdminId: auth,
          readAt: false,
        });
        return { count: totalDocument };
    }




    /**
    * @description: NOtification read at
    * @param {*} id 
    * @param {*} req 
    * @param {*} res 
    */
    static async notificationReadAt(auth, req, res) {
        await Notification.updateMany(
          {
            superAdminId: auth,
            readAt: false,
          },
          { readAt: true }
        );
        return;
    }

}

export default notificationServices;