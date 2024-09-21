import moment from "moment";

export default class NotificationHistoryResource {
  constructor(notification) {
    return notification.map((data) => ({
      _id: data._id,
      orderId: data.orderId,
      itemId: data.itemId,
      title: data.title,
      description: data.description,
      status: data.status,
      notificationType: data.notificationType,
      price: data.price ? data.price : null,
      rejectionReason: data.rejectionReason ? data.rejectionReason : null,
      isBuySell: data.isBuySell ? data.isBuySell : null,
      notificationDate: moment(data.createdAt).unix(),
      readAt: data.readAt,
    }));
  }
}
