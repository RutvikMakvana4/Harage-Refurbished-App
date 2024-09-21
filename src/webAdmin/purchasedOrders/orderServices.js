import moment from "moment";
import BuyOrder from "../../../model/buyOrder";
import ProductImages from "../../../model/productImages";
import Product from "../../../model/product";
import {
  sendPushNotificationBuyOrder,
  sendPushNotificationSuperAdmin,
} from "../../common/helper";
import SuperAdmin from "../../../model/superAdmin";

class orderServices {
  /**
   * @description: User purchased order page load
   * @param {*} req
   * @param {*} res
   */
  static async purchasedOrderPage(req, res) {
    const assignRoles = req.user ? req.user.assignRoles : [];
    return res.render("webAdmin/purchasedOrders/purchasedOrders", {
      assignRoles,
    });
  }

  /**
   * @description : Purchased orders list
   * @param {*} query
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async purchasedOrderList(query, req, res) {
    try {
      const { start, length, search, draw } = query;
      const page = parseInt(start) || 0;
      const limit = parseInt(length) || 10;

      const search_value = search.value;

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
        isBuying: true,
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
          isBuying: true,
          orderDate: {
            $gte: startDate,
            $lte: new Date(endDate),
          },
        };
      }

      const data = await BuyOrder.aggregate([
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
            from: "carts",
            localField: "cartId",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "products",
                  localField: "addToCart",
                  foreignField: "_id",
                  as: "addToCart",
                },
              },
            ],
            as: "cart",
          },
        },
        {
          $unwind: {
            path: "$cart",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "buyoneproducts",
            localField: "buyProductId",
            foreignField: "_id",
            pipeline: [
              {
                $lookup: {
                  from: "products",
                  localField: "buyOneProduct",
                  foreignField: "_id",
                  as: "buyOneProduct",
                },
              },
            ],
            as: "oneProduct",
          },
        },
        {
          $unwind: {
            path: "$oneProduct",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "shippingAddress",
            foreignField: "_id",
            as: "address",
          },
        },
        {
          $unwind: "$address",
        },
        {
          $lookup: {
            from: "stripecards",
            localField: "paymentMethod",
            foreignField: "_id",
            as: "methods",
          },
        },
        {
          $unwind: "$methods",
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
        // Add the $sort stage only if column_name is not empty
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
              {
                "cart.addToCart.name": { $regex: search_value, $options: "i" },
              },
              { "methods.cardName": { $regex: search_value, $options: "i" } },
            ],
          },
        },
      ]);
      // console.log(data[0].cart)

      const count = await BuyOrder.find({ isBuying: true }).count();

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
   * @description: Order products details
   * @param {*} req
   * @param {*} res
   */
  static async viewProductDetail(id, req, res) {
    const assignRoles = req.user ? req.user.assignRoles : [];

    const findProduct = await Product.findById({ _id: id });

    const findImages = await ProductImages.find({ productId: id });

    return res.json({ product: findProduct, img: findImages, assignRoles });
  }

  /**
   * @description : Update status of purchased order's
   * @param {*} req
   * @param {*} res
   */
  static async updateStatus(id, data, req, res) {
    try {
      const statusValue = parseInt(data.status);
      const paymentType = data.paymentType;

      const updateStatus = await BuyOrder.findByIdAndUpdate(
        id,
        { status: statusValue },
        { new: true }
      );

      if (paymentType == 1) {
        if (statusValue == 4) {
          const findOrder = await BuyOrder.findOne({ _id: id });

          if (findOrder) {
            await BuyOrder.findOneAndUpdate(
              { _id: id },
              {
                status: statusValue,
                deliveryDate: new Date(),
              }
            );
          }
        }
      } else {
        console.log(statusValue, "oo");
        if (statusValue == 5) {
          const findOrder = await BuyOrder.findOne({ _id: id });

          if (findOrder) {
            await BuyOrder.findOneAndUpdate(
              { _id: id },
              {
                status: statusValue,
                deliveryDate: new Date(),
              }
            );
          }
        }
      }

      const superAdmin = await SuperAdmin.findOne();

      if (statusValue === 2) {
        await sendPushNotificationBuyOrder(
          2,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          2,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 3) {
        await sendPushNotificationBuyOrder(
          3,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          3,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 4) {
        await sendPushNotificationBuyOrder(
          4,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          4,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 5) {
        await sendPushNotificationBuyOrder(
          5,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          5,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 6) {
        await sendPushNotificationBuyOrder(
          6,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          6,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 7) {
        await sendPushNotificationBuyOrder(
          7,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          7,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 8) {
        await sendPushNotificationBuyOrder(
          8,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          8,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 9) {
        await sendPushNotificationBuyOrder(
          9,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          9,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 10) {
        await sendPushNotificationBuyOrder(
          10,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          10,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      } else if (statusValue === 11) {
        await sendPushNotificationBuyOrder(
          11,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId
        );

        await sendPushNotificationSuperAdmin(
          11,
          updateStatus._id,
          superAdmin._id,
          updateStatus.orderId
        );
      }

      return updateStatus;
    } catch (err) {
      console.log(err);
    }
  }
}

export default orderServices;
