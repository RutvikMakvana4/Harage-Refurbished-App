import Notification from "../../../model/notifications";
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

    const totalDocument = await Notification.countDocuments({ userId: auth });
    const findNotification = await Notification.find({ userId: auth })
      .skip(page * pageLimit)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const meta = {
      total: totalDocument,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(totalDocument / pageLimit),
    };

    return { data: findNotification, meta };
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
      userId: auth,
      readAt: false,
    });
    return totalDocument;
  }

  /**
   * @description: Notification read at
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async notificationReadAt(auth, req, res) {
    await Notification.updateMany(
      {
        userId: auth,
        readAt: false,
      },
      { readAt: true }
    );
    return;
  }
}

export default notificationServices;
