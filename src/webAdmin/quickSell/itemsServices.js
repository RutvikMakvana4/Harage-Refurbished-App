import moment from "moment";
import SellItems from "../../../model/sellingItems";
import ItemImages from "../../../model/itemImages";
import Item from "../../../model/item";
import {
  createAdminLog,
  sendPushNotificationSellingOrder,
  sendPushNotificationSuperAdmin,
} from "../../common/helper";
import SuperAdmin from "../../../model/superAdmin";
import { NotFoundException } from "../../common/exceptions/errorException";
import { SELLER } from "../../common/constants/constants";

class itemServices {
  /**
   * @description: User quick sell items page load
   * @param {*} req
   * @param {*} res
   */
  static async quickSellPage(req, res) {
    const assignRoles = req.user ? req.user.assignRoles : [];
    return res.render("webAdmin/quickSell/quickSell", { assignRoles });
  }

  /**
   * @description : all quick sell users items list
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async quickSellList(query, req, res) {
    try {
      const { start, length, search, draw } = query ?? {};
      const page = parseInt(start) || 0;
      const limit = parseInt(length) || 10;

      const search_value = search?.value || "";

      // Sorting in datatable (ordering)
      const order_data = query.order;

      let column_name = "";
      let column_sort_order = "desc";

      if (order_data) {
        const column_index = parseInt(order_data[0].column);
        column_name = query.columns[column_index].data;
        column_sort_order = order_data[0].dir;
      }

      var matchparam = {
        isSelling: true,
      };

      if (query.startDate && query.endDate) {
        const startDateString = query.startDate;
        var [day, month, year] = startDateString.split("-").map(Number);
        const startDate = new Date(year, month - 1, day, 0, 0, 0);

        const endDateString = query.endDate;
        var [day, month, year] = endDateString.split("-").map(Number);
        const stringDate = new Date(year, month - 1, day, 0, 0, 0);
        const endDate = moment(stringDate).add(1, "day");

        var matchparam = {
          isSelling: true,
          orderDate: {
            $gte: startDate,
            $lte: new Date(endDate),
          },
        };
      }

      // const data = await SellItems.find(search_value ? search_query : { isSelling: true }).populate('userId').populate({ path: 'sellingItems' }).populate('pickUpAddress').skip(page).limit(limit).sort({ createdAt: -1 }).lean('sellingItems');

      const data = await SellItems.aggregate([
        {
          $match: matchparam,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "items",
            localField: "sellingItems.itemId",
            foreignField: "_id",
            as: "items",
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "pickUpAddress",
            foreignField: "_id",
            as: "address",
          },
        },
        {
          $unwind: "$address",
        },
        {
          $skip: page,
        },
        {
          $limit: limit,
        },
        {
          $sort: {
            orderDate: -1,
          },
        },
        ...(column_name
          ? [
              {
                $sort: {
                  [column_name]: column_sort_order === "desc" ? -1 : 1,
                  orderDate: -1,
                },
              },
            ]
          : []),
        {
          $match: {
            $or: [
              { orderId: { $regex: search_value, $options: "i" } },
              { orderDate: { $regex: search_value, $options: "i" } },
              { "user.fullName": { $regex: search_value, $options: "i" } },
              { "user.email": { $regex: search_value, $options: "i" } },
              { "user.phone": { $regex: search_value, $options: "i" } },
            ],
          },
        },
      ]);

      const count = await SellItems.find({ isSelling: true }).count();

      return res.send({
        draw: draw,
        iTotalRecords: count,
        iTotalDisplayRecords: count,
        aaData: data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description: quick sell item details
   * @param {*} req
   * @param {*} res
   */
  static async viewProductDetail(id, req, res) {
    const assignRoles = req.user ? req.user.assignRoles : [];

    const findItem = await Item.findById({ _id: id });

    const findImages = await ItemImages.find({ itemId: id });

    return res.json({ product: findItem, img: findImages, assignRoles });
  }

  /**
   * @description : update status of quick sell order`s
   * @param {*} req
   * @param {*} res
   */
  static async updateStatus(id, data, auth, req, res) {
    try {
      const statusValue = parseInt(data.status);

      const findSellOrder = await SellItems.findOne({ _id: id });

      if (!findSellOrder) {
        throw new NotFoundException("Order not found");
      }

      const updateStatus = await SellItems.findByIdAndUpdate(
        id,
        { status: statusValue },
        { new: true }
      );

      if (data.status == 1) {
        await SellItems.updateOne(
          { _id: id },
          {
            $set: { "sellingItems.$[].status": data.status },
          }
        );
      }

      if (data.status == 2) {
        await SellItems.updateOne(
          { _id: id },
          {
            $set: { "sellingItems.$[].status": data.status },
          }
        );
      }

      if (statusValue === 2) {
        const notificationData = {
          status: SELLER.UNDERREVIEW.toString(),
          notificationType: SELLER.UNDERREVIEW.toString(),
          orderId: updateStatus._id.toString(),
          auth: updateStatus.userId.toString(),
          orderNumber: updateStatus.orderId.toString(),
        };

        sendPushNotificationSellingOrder(notificationData);
      }

      return updateStatus;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description : Update items status
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async updateItemStatus(id, data, auth, req, res) {
    const status = parseInt(data.status, 10);

    const updatedItemStatus = await SellItems.findOneAndUpdate(
      { _id: data.orderId, "sellingItems.itemId": data.itemId },
      { $set: { "sellingItems.$.status": status } },
      { new: true }
    );

    const allItems = updatedItemStatus.sellingItems;

    let allStatusAreThree = true;
    let allStatusAreFour = true;
    let hasStatusThree = false;
    let hasStatusFour = false;
    let hasStatusTwo = false;

    allItems.forEach((item) => {
      if (item.status !== 3) {
        allStatusAreThree = false;
      }
      if (item.status !== 4) {
        allStatusAreFour = false;
      }
      if (item.status === 3) {
        hasStatusThree = true;
      }
      if (item.status === 4) {
        hasStatusFour = true;
      }
      if (item.status === 2) {
        hasStatusTwo = true;
      }
    });

    let statusUpdatedValue;

    if (allStatusAreThree) {
      statusUpdatedValue = 5;
    } else if (allStatusAreFour) {
      statusUpdatedValue = 4;
    } else if (hasStatusThree && hasStatusFour) {
      statusUpdatedValue = 3;
    } else if (hasStatusThree && hasStatusTwo) {
      statusUpdatedValue = 2;
    } else if (hasStatusThree || hasStatusFour) {
      statusUpdatedValue = 4;
    }

    console.log(statusUpdatedValue, "final order status");

    if (statusUpdatedValue == 3) {
      const updatedSellOrder = await SellItems.findOneAndUpdate(
        { _id: data.orderId },
        {
          status: statusUpdatedValue,
        }
      );

      const notificationData = {
        status: SELLER.PARCIALACCEPTANCE.toString(),
        notificationType: SELLER.PARCIALACCEPTANCE.toString(),
        orderId: updatedSellOrder._id.toString(),
        auth: updatedSellOrder.userId.toString(),
        orderNumber: updatedSellOrder.orderId.toString(),
      };

      sendPushNotificationSellingOrder(notificationData);
    }

    if (statusUpdatedValue == 4) {
      const updatedSellOrder = await SellItems.findOneAndUpdate(
        { _id: data.orderId },
        {
          status: statusUpdatedValue,
        }
      );

      const notificationData = {
        status: SELLER.ORDERREJECTED.toString(),
        notificationType: SELLER.ORDERREJECTED.toString(),
        orderId: updatedSellOrder._id.toString(),
        auth: updatedSellOrder.userId.toString(),
        orderNumber: updatedSellOrder.orderId.toString(),
      };

      sendPushNotificationSellingOrder(notificationData);
    }

    if (statusUpdatedValue == 5) {
      const updatedSellOrder = await SellItems.findOneAndUpdate(
        { _id: data.orderId },
        {
          status: statusUpdatedValue,
        }
      );

      const notificationData = {
        status: SELLER.COMPLETED.toString(),
        notificationType: SELLER.COMPLETED.toString(),
        orderId: updatedSellOrder._id.toString(),
        auth: updatedSellOrder.userId.toString(),
        orderNumber: updatedSellOrder.orderId.toString(),
      };

      sendPushNotificationSellingOrder(notificationData);
    }

    return res.status(200).send(updatedItemStatus);
  }

  /**
   * @description: Send price change request
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async sendPriceRequest(data, req, res) {
    console.log(data);
    const orderId = data.orderId;
    const itemId = data.itemId;
    const price = parseInt(data.price);

    const findOrder = await SellItems.findOne({ _id: orderId });
    if (!findOrder) {
      throw new NotFoundException("Order not found");
    }

    const findOrderItems = findOrder.sellingItems;

    // Check if itemId is in findOrderItems
    const itemExists = findOrderItems.some(
      (item) => item.itemId.toString() === itemId
    );

    if (!itemExists) {
      throw new NotFoundException("Item not found in the order");
    }

    await Item.findByIdAndUpdate(
      itemId,
      {
        newPrice: price,
        isConfirmRequest: true,
      },
      { new: true }
    );

    const notificationData = {
      status: SELLER.PRICE_CHANGE.toString(),
      notificationType: SELLER.PRICE_CHANGE.toString(),
      orderId: findOrder._id.toString(),
      itemId: itemId.toString(),
      auth: findOrder.userId.toString(),
      orderNumber: findOrder.orderId.toString(),
    };

    sendPushNotificationSellingOrder(notificationData);
  }

  /**
   * @description: Send rejection reason
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async sendRejectionReason(query, req, res) {
    const orderId = query.orderId;
    const itemId = query.itemId;
    const rejectionReason = query.rejectionReason;

    const findOrder = await SellItems.findOne({ _id: orderId });
    if (!findOrder) {
      throw new NotFoundException("Order not found");
    }

    const findOrderItems = findOrder.sellingItems;

    // Check if itemId is in findOrderItems
    const itemExists = findOrderItems.some(
      (item) => item.itemId.toString() === itemId
    );

    if (!itemExists) {
      throw new NotFoundException("Item not found in the order");
    }

    await Item.findByIdAndUpdate(
      itemId,
      {
        rejectionReason: rejectionReason,
      },
      { new: true }
    );

    const notificationData = {
      status: SELLER.REJECTION_REASON.toString(),
      notificationType: SELLER.REJECTION_REASON.toString(),
      orderId: findOrder._id.toString(),
      itemId: itemId.toString(),
      auth: findOrder.userId.toString(),
      orderNumber: findOrder.orderId.toString(),
      rejectionReason: rejectionReason,
    };

    sendPushNotificationSellingOrder(notificationData);
  }

  /**
   * send for confirmation
   * @param {*} query
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async sendForConfirmation(query, data, req, res) {
    const orderId = query.orderId;
    const sellingItems = req.body;
    const items = sellingItems.items;

    const findOrder = await SellItems.findOne({ _id: orderId });
    if (!findOrder) {
      throw new NotFoundException("Order not found");
    }

    const findOrderItems = findOrder.sellingItems;

    items.map((item) => {
      const itemExists = findOrderItems.some(
        (i) => i.itemId.toString() === item.itemId
      );

      if (!itemExists) {
        throw new NotFoundException("Item not found in the order");
      }
    });

    items.map(async (item) => {
      if (item.status === 3) {
        // Update the price
        await Item.findByIdAndUpdate(
          item.itemId,
          {
            newPrice: item.price,
          },
          { new: true }
        );

        await SellItems.findOneAndUpdate(
          { _id: findOrder._id, "sellingItems.itemId": item.itemId },
          { $set: { "sellingItems.$.status": item.status } },
          { new: true }
        );

        await SellItems.findByIdAndUpdate(
          findOrder._id,
          {
            status: 7,
          },
          { new: true }
        );

        const notificationData = {
          status: SELLER.PRICE_CHANGE.toString(),
          notificationType: SELLER.PRICE_CHANGE.toString(),
          orderId: findOrder._id.toString(),
          itemId: item.itemId.toString(),
          auth: findOrder.userId.toString(),
          orderNumber: findOrder.orderId.toString(),
          orderStatus: findOrder.status.toString(),
        };

        sendPushNotificationSellingOrder(notificationData);
      } else if (item.status === 4) {
        // Handle rejection
        const rejectedItem = await Item.findByIdAndUpdate(
          item.itemId,
          {
            rejectionReason: item.rejectionReason,
          },
          { new: true }
        );
        console.log(rejectedItem.price, "org price");

        await SellItems.findOneAndUpdate(
          { _id: findOrder._id, "sellingItems.itemId": item.itemId },
          { $set: { "sellingItems.$.status": item.status } },
          { new: true }
        );

        // const removePrice = parseFloat(rejectedItem.price) || 0;
        const removePrice = parseFloat(item.price);
        console.log(removePrice, "removePrice");
        const totalPrice = parseFloat(findOrder.totalPrice) || 0;
        console.log(totalPrice, "total");

        // Calculate the final price
        const finalPrice = totalPrice - removePrice;
        console.log(finalPrice, "finalPrice");

        const updateOrderStatus = await changeSellingOrderStatus(orderId);

        await SellItems.findByIdAndUpdate(
          findOrder._id,
          {
            status: updateOrderStatus,
            totalPrice: finalPrice,
            totalOrder: parseInt(findOrder.totalOrder) - 1,
          },
          { new: true }
        );
      } else {
        throw new BadRequestException("Please enter correct status");
      }
    });
  }
}

export default itemServices;
