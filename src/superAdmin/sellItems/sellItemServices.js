import mongoose from "mongoose";
import SellItems from "../../../model/sellingItems";
import SellingOrderResource from "./resources/sellingOrderResource";
import {
  BadRequestException,
  InternalServerError,
  NotFoundException,
} from "../../../src/common/exceptions/errorException";
import BuyingOrderDetailsResource from "../../apis/orderHistory/resources/buyingOrderDetailResources";
import BuyOrder from "../../../model/buyOrder";
import ProductImages from "../../../model/productImages";
import SubSubCategory from "../../../model/subSubCategories";
import SubCategory from "../../../model/subCategories";
import Category from "../../../model/categories";
import Cart from "../../../model/cart";
import SellingOrderDetailsResource from "../../apis/orderHistory/resources/sellingOrderDetailResources";
import {
  changeSellingOrderStatus,
  isValidObjectId,
  sendPushNotificationBuyOrder,
  sendPushNotificationSellingOrder,
} from "../../common/helper";
import BuyOneProduct from "../../../model/buyOneProduct";
import ItemImages from "../../../model/itemImages";
import SubAdmin from "../../../model/subAdmin";
import { sendMail } from "../../common/sendEmail";
import RejectionReason from "../../../model/rejectionReason";
import { SELLER } from "../../common/constants/constants";
import Item from "../../../model/item";
import Notification from "../../../model/notifications";
import OneItemResource from "../../apis/quickSell/resources/OneItemResources";

class sellItemsServices {
  /**
   * @description : order history - sell items order
   * @param {*} auth
   * @param {*} id
   * @param {*} data
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async sellingHistory(query, auth, req, res) {
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;

    if (query.type === "0") {
      const historyDetails = await SellItems.find({ isSelling: true })
        .populate("sellingItems")
        .populate("pickUpAddress")
        .populate("assignMember")
        .skip(page * pageLimit)
        .limit(pageLimit)
        .sort({ orderDate: -1 });

      const totalDocument = await SellItems.find({ isSelling: true }).count();

      const notificationCounts = await Notification.countDocuments({
        superAdminId: auth,
        readAt: false,
      });

      const meta = {
        total: totalDocument,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(totalDocument / pageLimit),
        notificationCount: notificationCounts,
      };

      const orderResource = new SellingOrderResource(historyDetails);

      return { data: orderResource.items, meta };
    } else if (query.type === "1") {
      const historyDetails = await BuyOrder.find({ isBuying: true })
        .populate("assignMember")
        .populate("paymentMethod")
        .skip(page * pageLimit)
        .limit(pageLimit)
        .sort({ orderDate: -1 });

      const totalDocument = await BuyOrder.find({ isBuying: true }).count();

      const notificationCounts = await Notification.countDocuments({
        superAdminId: auth,
        readAt: false,
      });

      const meta = {
        total: totalDocument,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(totalDocument / pageLimit),
        notificationCount: notificationCounts,
      };

      const orderResource = new SellingOrderResource(historyDetails);

      return { data: orderResource.items, meta };
    }
  }

  /**
   * Order full details
   * @param {*} query
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async orderFullDetails(query, req, res) {
    const { type, orderId } = query;

    isValidObjectId(orderId);

    // try {
    if (type === "0") {
      const historyDetails = await SellItems.findById({
        _id: orderId,
        isSelling: true,
      })
        .populate("userId")
        .populate("sellingItems.itemId")
        .populate("pickUpAddress");

      if (!historyDetails) {
        throw new BadRequestException("Order id not found");
      }

      const itemsData = historyDetails.sellingItems;

      const itemDetails = await Promise.all(
        itemsData.map(async (value) => {
          const category = await Category.findOne({
            _id: value.itemId.categoryId,
          });
          const subCategory = await SubCategory.findOne({
            _id: value.itemId.subCategoryId,
          });
          const subSubCategory = await SubSubCategory.findOne({
            _id: value.itemId.subSubCategoryId,
          });

          if (category || subCategory) {
            return {
              ...value.itemId._doc,
              categoryId: value.itemId.categoryId,
              category: category,
              subCategoryId: value.itemId.subCategoryId
                ? value.itemId.subCategoryId
                : null,
              subCategory: subCategory ? subCategory : null,
              subSubCategory: subSubCategory,
              status: value.status,
            };
          }
        })
      );

      const itemIds = itemsData.map((item) => item.itemId._id);
      const findImage = await ItemImages.find({ itemId: { $in: itemIds } });

      const detailsHistory = await SellItems.findById({
        _id: orderId,
        isSelling: true,
      })
        .populate("userId")
        .populate("sellingItems.itemId")
        .populate("pickUpAddress")
        .populate("assignMember");

      return {
        ...new SellingOrderDetailsResource(
          detailsHistory,
          itemDetails,
          findImage
        ),
      };
    } else if (type === "1") {
      const findOrder = await BuyOrder.findById({
        _id: orderId,
        isBuying: true,
      });

      if (!findOrder) {
        throw new BadRequestException("Order id not found");
      }

      if (findOrder.actionType === "0") {
        const buyNowOrder = await BuyOrder.findById(findOrder._id)
          .populate("buyProductId")
          .populate("shippingAddress")
          .populate("paymentMethod");

        const product = buyNowOrder.buyProductId;
        const findBuyOneProduct = await BuyOneProduct.findOne(
          product._id
        ).populate("buyOneProduct");

        const orderProducts = findBuyOneProduct.buyOneProduct;

        const orderProductsArray = Array.isArray(orderProducts)
          ? orderProducts
          : [orderProducts];

        var allProducts = await Promise.all(
          orderProductsArray.map(async (value) => {
            const category = await Category.findOne({ _id: value.categoryId });
            const subCategory = await SubCategory.findOne({
              _id: value.subCategoryId,
            });

            if (category || subCategory) {
              return {
                ...value._doc,
                category,
                subCategory: subCategory || null,
              };
            }
          })
        );

        const productIds = orderProductsArray.map((product) => product._id);
        const findImage = await ProductImages.find({
          productId: { $in: productIds },
        });

        const detailsHistory = await BuyOrder.findById({
          _id: orderId,
          isBuying: true,
        })
          .populate("userId")
          .populate("buyProductId")
          .populate("shippingAddress")
          .populate("paymentMethod")
          .populate("assignMember");

        return {
          ...new BuyingOrderDetailsResource(
            detailsHistory,
            allProducts,
            findImage
          ),
        };
      } else {
        const cartOrder = await BuyOrder.findById(findOrder._id)
          .populate("cartId")
          .populate("shippingAddress");

        const cart = cartOrder.cartId;
        const findCart = await Cart.findOne(cart._id).populate("addToCart");

        const products = findCart.addToCart;

        const productDetails = await Promise.all(
          products.map(async (value) => {
            const category = await Category.findOne({ _id: value.categoryId });
            const subCategory = await SubCategory.findOne({
              _id: value.subCategoryId,
            });
            const subSubCategory = await SubSubCategory.findOne({
              _id: value.subSubCategoryId,
            });

            if (category || subCategory) {
              return {
                ...value._doc,
                categoryId: value.categoryId,
                category: category,
                subCategoryId: value.subCategoryId ? value.subCategoryId : null,
                subCategory: subCategory ? subCategory : null,
                subSubCategory: subSubCategory,
              };
            }
          })
        );

        const productIds = products.map((product) => product._id);
        const findImage = await ProductImages.find({
          productId: { $in: productIds },
        });

        const detailsHistory = await BuyOrder.findById({
          _id: orderId,
          isBuying: true,
        })
          .populate("userId")
          .populate("cartId")
          .populate("shippingAddress")
          .populate("paymentMethod")
          .populate("assignMember");

        return {
          ...new BuyingOrderDetailsResource(
            detailsHistory,
            productDetails,
            findImage
          ),
        };
      }
    }
    // } catch (error) {
    //     // console.log(error, "error")
    //     throw new InternalServerError("Internal server error")
    // }
  }

  /**
   * @description : assign member
   * @param {*} req
   * @param {*} res
   */
  static async assignMember(query, req, res) {
    const { type, orderId, memberId } = query;

    isValidObjectId(orderId);
    isValidObjectId(memberId);

    const findMember = await SubAdmin.findById(memberId);
    if (!findMember) {
      throw new BadRequestException("Member id not found");
    }

    const assignRoles = type === "0" ? "Selling" : "Buying (Purchage)";

    if (type === "0") {
      const findSellingOrder = await SellItems.findOne({ _id: orderId });

      if (!findSellingOrder) {
        throw new NotFoundException("Order not found");
      }

      const assignMember = await SellItems.findOneAndUpdate(
        { _id: orderId },
        { isAssigned: true, assignMember: memberId, status: 2 },
        { new: true }
      );

      await SellItems.updateOne(
        { _id: orderId },
        { $set: { "sellingItems.$[].status": 2 } }
      );

      const appLink = `${process.env.APP_URL_ADMIN}/webAdmin/login`;
      const obj = {
        to: findMember.email,
        subject: `New Order assign for ${process.env.APP_NAME}`,
        data: {
          assignRoles: assignRoles,
          orderId: assignMember.orderId,
          orderLink: appLink,
        },
      };
      sendMail(obj, "assignRolesMail");

      return;
    } else if (type === "1") {
      const findBuyerOrder = await BuyOrder.findOne({ _id: orderId }).populate(
        "paymentMethod"
      );

      if (!findBuyerOrder) {
        throw new NotFoundException("Order not found");
      }

      let assignMember;

      if (findBuyerOrder.paymentMethod.type == 1) {
        console.log("1");
        assignMember = await BuyOrder.findOneAndUpdate(
          { _id: orderId },
          { isAssigned: true, assignMember: memberId, status: 2 },
          { new: true }
        );
      } else if (findBuyerOrder.paymentMethod.type == 2) {
        console.log("2");
        assignMember = await BuyOrder.findOneAndUpdate(
          { _id: orderId },
          { isAssigned: true, assignMember: memberId, status: 3 },
          { new: true }
        );
      }

      const appLink = `${process.env.APP_URL_ADMIN}/webAdmin/login`;
      const obj = {
        to: findMember.email,
        subject: `New Order assign for ${process.env.APP_NAME}`,
        data: {
          assignRoles: assignRoles,
          orderId: assignMember.orderId,
          orderLink: appLink,
        },
      };
      sendMail(obj, "assignRolesMail");

      return;
    }

    // if (mongoose.Types.ObjectId.isValid(id)) {
    //     const orderId = query.orderId;

    //     const assignMember = await SellItems.findOneAndUpdate({ _id: orderId }, { isAssigned: true, assignMember: id }, { new: true });

    //     // const appLink = `${process.env.APP_URL_ADMIN}/webAdmin/login`
    //     // const obj = {
    //     //     to: email,
    //     //     subject: `Your Credentials for ${process.env.APP_NAME}`,
    //     //     data: { assignRoles, email, password, appLink }
    //     // }
    //     // sendMail(obj, 'assignRolesMail');

    //     return;
    // }
    // else {
    //     throw new BadRequestException("Please provide correct member id");
    // }
  }

  /**
   * @description: Update order status
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async updateOrderStatus(query, req, res) {
    const type = parseInt(query.type);
    const orderId = query.orderId;
    const paymentType = parseInt(query.paymentType);
    const statusValue = parseInt(query.statusValue);

    if (type == 0) {
      console.log("0 - selling");

      const findSellOrder = await SellItems.findOne({ _id: orderId });

      if (!findSellOrder) {
        throw new NotFoundException("Order not found");
      }

      if (statusValue > 3) {
        throw new BadRequestException("Please enter correct statusValue");
      }

      const updateOrderStatus = await SellItems.findByIdAndUpdate(
        orderId,
        { status: statusValue },
        { new: true }
      );

      if (statusValue && updateOrderStatus) {
        await SellItems.updateOne(
          { _id: orderId },
          {
            $set: { "sellingItems.$[].status": statusValue },
          }
        );
      }

      // update status notifications
      if (statusValue == 2) {
        const notificationData = {
          status: SELLER.UNDERREVIEW.toString(),
          notificationType: SELLER.UNDERREVIEW.toString(),
          orderId: updateOrderStatus._id.toString(),
          auth: updateOrderStatus.userId.toString(),
          orderNumber: updateOrderStatus.orderId.toString(),
        };

        sendPushNotificationSellingOrder(notificationData);
      }

      return;
    } else if (type == 1) {
      console.log("1 - Buying");

      if (statusValue > 5) {
        throw new BadRequestException("statusValue is incorrect");
      }

      if (paymentType == 1) {
        if (statusValue > 4) {
          throw new BadRequestException("Please enter correct statusValue");
        }
      } else if (paymentType == 2) {
        if (statusValue > 5) {
          throw new BadRequestException("Please enter correct statusValue");
        }
      }

      const updateStatus = await BuyOrder.findByIdAndUpdate(
        orderId,
        { status: statusValue },
        { new: true }
      );

      if (paymentType == 1) {
        if (statusValue == 4) {
          const findOrder = await BuyOrder.findOne({
            _id: orderId,
          });

          if (findOrder) {
            await BuyOrder.findOneAndUpdate(
              { _id: orderId },
              {
                status: statusValue,
                deliveryDate: new Date(),
              }
            );
          }
        }
      } else {
        if (statusValue == 5) {
          const findOrder = await BuyOrder.findOne({
            _id: orderId,
          });

          if (findOrder) {
            await BuyOrder.findOneAndUpdate(
              { _id: orderId },
              {
                status: statusValue,
                deliveryDate: new Date(),
              }
            );
          }
        }
      }

      if (statusValue === 2) {
        await sendPushNotificationBuyOrder(
          2,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId,
          paymentType
        );
      } else if (statusValue === 3) {
        await sendPushNotificationBuyOrder(
          3,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId,
          paymentType
        );
      } else if (statusValue === 4) {
        await sendPushNotificationBuyOrder(
          4,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId,
          paymentType
        );
      } else if (statusValue === 5) {
        await sendPushNotificationBuyOrder(
          5,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId,
          paymentType
        );
      } else if (statusValue === 6) {
        await sendPushNotificationBuyOrder(
          6,
          updateStatus._id,
          updateStatus.userId,
          updateStatus.orderId,
          paymentType
        );
      }
    }
  }

  /**
   * @description: Update order items status
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async updateOrderItemsStatus(query, req, res) {
    const orderId = query.orderId;
    const statusValue = parseInt(query.statusValue);
    const itemId = query.itemId;

    const findSellOrder = await SellItems.findOne({ _id: orderId }).populate(
      "sellingItems"
    );

    if (!findSellOrder) {
      throw new NotFoundException("Sell order not found");
    }

    const findOrderItems = findSellOrder.sellingItems;

    // Check if itemId is in findOrderItems
    const itemExists = findOrderItems.some(
      (item) => item.itemId.toString() === itemId
    );

    if (!itemExists) {
      throw new NotFoundException("Item not found in the order");
    }

    const updatedItemStatus = await SellItems.findOneAndUpdate(
      { _id: findSellOrder._id, "sellingItems.itemId": itemId },
      { $set: { "sellingItems.$.status": statusValue } },
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

    // if (statusUpdatedValue == 3) {
    //   const updatedSellOrder = await SellItems.findOneAndUpdate(
    //     { _id: orderId },
    //     {
    //       status: statusUpdatedValue,
    //     }
    //   );

    //   const notificationData = {
    //     status: SELLER.PARCIALACCEPTANCE.toString(),
    //     notificationType: SELLER.PARCIALACCEPTANCE.toString(),
    //     orderId: updatedSellOrder._id.toString(),
    //     auth: updatedSellOrder.userId.toString(),
    //     orderNumber: updatedSellOrder.orderId.toString(),
    //   };

    //   sendPushNotificationSellingOrder(notificationData);
    // }

    // if (statusUpdatedValue == 4) {
    //   const updatedSellOrder = await SellItems.findOneAndUpdate(
    //     { _id: orderId },
    //     {
    //       status: statusUpdatedValue,
    //     }
    //   );

    //   const notificationData = {
    //     status: SELLER.ORDERREJECTED.toString(),
    //     notificationType: SELLER.ORDERREJECTED.toString(),
    //     orderId: updatedSellOrder._id.toString(),
    //     auth: updatedSellOrder.userId.toString(),
    //     orderNumber: updatedSellOrder.orderId.toString(),
    //   };

    //   sendPushNotificationSellingOrder(notificationData);
    // }

    // if (statusUpdatedValue == 5) {
    //   const updatedSellOrder = await SellItems.findOneAndUpdate(
    //     { _id: orderId },
    //     {
    //       status: statusUpdatedValue,
    //     }
    //   );

    //   const notificationData = {
    //     status: SELLER.COMPLETED.toString(),
    //     notificationType: SELLER.COMPLETED.toString(),
    //     orderId: updatedSellOrder._id.toString(),
    //     auth: updatedSellOrder.userId.toString(),
    //     orderNumber: updatedSellOrder.orderId.toString(),
    //   };

    //   sendPushNotificationSellingOrder(notificationData);
    // }

    return;
  }

  /**
   * @description: Send price change request
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async sendPriceRequest(query, req, res) {
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
        const removePrice = parseFloat(item.price)
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

    // const orderId = query.orderId;
    // const sellingItems = req.body;

    // const items = sellingItems.items;

    // const findOrder = await SellItems.findOne({ _id: orderId });
    // if (!findOrder) {
    //   throw new NotFoundException("Order not found");
    // }

    // const findOrderItems = findOrder.sellingItems;

    // items.map((item) => {
    //   const itemExists = findOrderItems.some(
    //     (i) => i.itemId.toString() === item.itemId
    //   );

    //   if (!itemExists) {
    //     throw new NotFoundException("Item not found in the order");
    //   }
    // });

    // items.map(async (item) => {
    //   await Item.findByIdAndUpdate(
    //     item.itemId,
    //     {
    //       newPrice: item.price,
    //     },
    //     { new: true }
    //   );

    //   await SellItems.findByIdAndUpdate(
    //     findOrder._id,
    //     {
    //       status: 7,
    //     },
    //     { new: true }
    //   );

    //   const notificationData = {
    //     status: SELLER.PRICE_CHANGE.toString(),
    //     notificationType: SELLER.PRICE_CHANGE.toString(),
    //     orderId: findOrder._id.toString(),
    //     itemId: item.itemId.toString(),
    //     auth: findOrder.userId.toString(),
    //     orderNumber: findOrder.orderId.toString(),
    //     orderStatus: findOrder.status.toString(),
    //   };

    //   sendPushNotificationSellingOrder(notificationData);
    // });
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

    const rejectedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        rejectionReason: rejectionReason,
      },
      { new: true }
    );

    await SellItems.findOneAndUpdate(
      { _id: findOrder._id, "sellingItems.itemId": itemId },
      { $set: { "sellingItems.$.status": 4 } },
      { new: true }
    );

    const removePrice = parseFloat(rejectedItem.price) || 0;
    const totalPrice = parseFloat(findOrder.totalPrice) || 0;

    // Calculate the final price
    const finalPrice = totalPrice - removePrice;

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

    const notificationData = {
      status: SELLER.REJECTION_REASON.toString(),
      notificationType: SELLER.REJECTION_REASON.toString(),
      orderId: findOrder._id.toString(),
      itemId: itemId.toString(),
      auth: findOrder.userId.toString(),
      orderNumber: findOrder.orderId.toString(),
      rejectionReason: rejectionReason,
      orderStatus: findOrder.status.toString(),
    };

    sendPushNotificationSellingOrder(notificationData);
  }

  /**
   * @description
   * @param {*} query
   * @param {*} req
   * @param {*} res
   */
  static async itemDetails(query, req, res) {
    try {
      const { itemId } = query;

      const findItem = await Item.findOne({ _id: itemId });
      if (!findItem) {
        throw new NotFoundException("Item not found");
      }

      const findImage = await ItemImages.find({ itemId: itemId });

      return { data: new OneItemResource(findItem, findImage) };
    } catch (error) {
      console.log(error);
    }
  }
}

export default sellItemsServices;
