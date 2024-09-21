import { baseUrl } from "../../src/common/constants/configConstants";
import fs from "fs";
import path from "path";
import UserLogs from "../../model/userLogs";
import AdminLogs from "../../model/adminLogs";
import {
  BadRequestException,
  NotFoundException,
} from "./exceptions/errorException";
import mongoose from "mongoose";
import FcmHelper from "./fcmHelper";
import { BUYER, SELLER, SUPERADMIN, TYPE } from "./constants/constants";
import FcmStore from "../../model/fcmToken";
import Notification from "../../model/notifications";
import SellItems from "../../model/sellingItems";
import Item from "../../model/item";

/**
 * @description : generate random string for given length
 * @param {number} length : length of random string to be generated (default 75)
 * @return {number} : generated random string
 */
export const randomStringGenerator = (givenLength = 75) => {
  const characters =
    givenLength > 10
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = givenLength;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomStrGen = Math.floor(Math.random() * characters.length);
    randomString += characters[randomStrGen];
  }
  return randomString;
};

/**
 * @description : generate random number for given length
 * @param {number} length : length of random number to be generated (default 75)
 * @return {number} : generated random number
 */
export const randomNumberGenerator = (givenLength = 5) => {
  const characters = "123456789";
  const length = givenLength;
  let randomNumber = "";

  for (let i = 0; i < length; i++) {
    const randomNumGen = Math.floor(Math.random() * characters.length);
    randomNumber += characters[randomNumGen];
  }
  return randomNumber;
};

export const logo = () => {
  return baseUrl("/img/logo2.svg");
};

/**
 * @description : remove files from folder
 * @param filename : file name store in database
 * @return { boolean } : true/false
 */
export const unlinkFile = async (filename) => {
  const img = path.join(`${__dirname}` + `../../../../${filename}`);

  if (fs.existsSync(img)) {
    try {
      fs.unlinkSync(img);
      return true;
    } catch (error) {
      console.log("Error :", error);
    }
  } else {
    console.log("Image does not exist.");
  }

  return false;
};

/**
 * @description : Create user logs for diffrent actions
 * @param {*} userId
 * @param {*} ipAddress
 * @param {*} action
 * @param {*} description
 * @returns
 */
export const createUserLog = (userId, ipAddress, action, description) => {
  return UserLogs.create({
    userId: userId,
    ipAddress: ipAddress,
    action: action,
    description: description,
    date: new Date(),
    time: new Date(),
  });
};

/**
 * @description : Create admin logs for diffrent actions
 * @param {*} adminId
 * @param {*} ipAddress
 * @param {*} action
 * @param {*} description
 * @returns
 */
export const createAdminLog = (
  adminId,
  ipAddress,
  role,
  action,
  description
) => {
  return AdminLogs.create({
    adminId: adminId,
    ipAddress: ipAddress,
    role: role,
    action: action,
    description: description,
    date: new Date(),
    time: new Date(),
  });
};

/**
 * @description : Check mongoose object id is valid or not
 * @param {*} id
 * @returns
 */
export const isValidObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException("Please provide a correct id");
  }
};

/**
 * @description: Send push notification foe ride
 * @param {*} status
 * @param {*} id
 * @returns
 */
export const sendPushNotificationBuyOrder = async (
  status,
  orderId,
  auth,
  orderNumber,
  paymentMethod
) => {
  const tokens = [];
  (await FcmStore.find({ userId: auth })).forEach(function (document) {
    tokens.push(document.token);
  });

  const payload = {
    notification: {
      title: "",
      body: "",
    },
    data: {
      orderId: orderId.toString(),
      paymentMethod: paymentMethod,
      orderType: TYPE.BUYER.toString(),
    },
  };

  if (paymentMethod == 1) {
    if (status === 1) {
      (payload.notification.title = "Order Placed"),
        (payload.notification.body = `Your order (#${orderNumber}) has been placed. You can track its status in your orders section.`);
      payload.data.type = BUYER.COD.ORDERPLACED.toString();
    } else if (status === 2) {
      (payload.notification.title = "Processing"),
        (payload.notification.body = `Your order (#${orderNumber}) is being processed. We'll update you when it ships.`);
      payload.data.type = BUYER.COD.PROCESSING.toString();
    } else if (status === 3) {
      (payload.notification.title = "Out for Delivery"),
        (payload.notification.body = `Your order (#${orderNumber}) is out for delivery and should arrive today.`);
      payload.data.type = BUYER.COD.OUTOFDELIVERY.toString();
    } else if (status === 4) {
      (payload.notification.title = "Delivered"),
        (payload.notification.body = `Your order (#${orderNumber}) has been delivered.`);
      payload.data.type = BUYER.COD.DELIVERED.toString();
    }
  } else {
    if (status === 1) {
      (payload.notification.title = "Order Placed"),
        (payload.notification.body = `Your order (#${orderNumber}) has been placed. You can track its status in your orders section.`);
      payload.data.type = BUYER.SKIPCASH.ORDERPLACED.toString();
    } else if (status === 2) {
      (payload.notification.title = "Payment Confirmed"),
        (payload.notification.body = `Payment for order (#${orderNumber}) has been successfully processed.`);
      payload.data.type = BUYER.SKIPCASH.PAYMENTCONFIRM.toString();
    } else if (status === 3) {
      (payload.notification.title = "Processing"),
        (payload.notification.body = `Your order (#${orderNumber}) is being processed. We'll update you when it ships.`);
      payload.data.type = BUYER.SKIPCASH.PROCESSING.toString();
    } else if (status === 4) {
      (payload.notification.title = "Out for Delivery"),
        (payload.notification.body = `Your order (#${orderNumber}) is out for delivery and should arrive today.`);
      payload.data.type = BUYER.SKIPCASH.OUTOFDELIVERY.toString();
    } else if (status === 5) {
      (payload.notification.title = "Delivered"),
        (payload.notification.body = `Your order (#${orderNumber}) has been delivered.`);
      payload.data.type = BUYER.SKIPCASH.DELIVERED.toString();
    }
  }

  if (status === 6) {
    (payload.notification.title = "Cancelled"),
      (payload.notification.body = `Your order (#${orderNumber}) has been cancelled.`);
    payload.data.type = BUYER.CANCELLED.toString();
  }

  if (status === 7) {
    (payload.notification.title = "Returned"),
      (payload.notification.body = `We have received your return for order (#${orderNumber}).`);
    payload.data.type = BUYER.RETURNED.toString();
  }

  if (status === 8) {
    (payload.notification.title = "Returned"),
      (payload.notification.body = `Your refund for order (#${orderNumber}) has been processed.`);
    payload.data.type = BUYER.REFUNDED.toString();
  }

  // Notification store
  await Notification.create({
    userId: auth,
    orderId: orderId,
    isBuySell: 0,
    notificationType: payload.data.type,
    title: payload.notification.title,
    description: payload.notification.body,
  });

  console.log("send Notification....");
  console.log(payload, "Buying order payload");

  await FcmHelper.sendPushNotification(tokens, payload);
};

/**
 * @description: Send push notification foe ride
 * @param {*} status
 * @param {*} id
 * @returns
 */
export const sendPushNotificationSellingOrder = async (notificationData) => {
  const tokens = [];
  (await FcmStore.find({ userId: notificationData.auth })).forEach(function (
    document
  ) {
    tokens.push(document.token);
  });

  const payload = {
    notification: {
      title: "",
      body: "",
    },
    data: {
      ...notificationData,
    },
  };

  let status = notificationData.status;
  let orderNumber = notificationData.orderNumber;

  if (status == 1) {
    (payload.notification.title = "Submitted"),
      (payload.notification.body = `Your sell order request (#${orderNumber}) has been submitted. It is currently under review.`);
    payload.data.notificationType = SELLER.SUBMITTED.toString();
  } else if (status == 2) {
    (payload.notification.title = "Under Review"),
      (payload.notification.body = `Your sell order request (#${orderNumber}) is being reviewed. We'll update you shortly.`);
    payload.data.notificationType = SELLER.UNDERREVIEW.toString();
  } else if (status == 3) {
    (payload.notification.title = "Partial Acceptance"),
      (payload.notification.body = `Some items in your order (#${orderNumber}) have been accepted. View details for accepted and pending items.`);
    payload.data.notificationType = SELLER.PARCIALACCEPTANCE.toString();
  } else if (status == 4) {
    (payload.notification.title = "Order Rejected"),
      (payload.notification.body = `Your sell order request (#${orderNumber}) has been rejected. Please see the reason(s) provided.`);
    payload.data.notificationType = SELLER.ORDERREJECTED.toString();
  } else if (status == 5) {
    (payload.notification.title = "Completed"),
      (payload.notification.body = `Your sell order (#${orderNumber}) has been completed. Payment details will be provided.`);
    payload.data.notificationType = SELLER.COMPLETED.toString();
  } else if (status == 6) {
    (payload.notification.title = "Cancelled"),
      (payload.notification.body = `Your sell order request (#${orderNumber}) has been cancelled.`);
    payload.data.notificationType = SELLER.CANCELLED.toString();
  } else if (status == 7) {
    (payload.notification.title = "Pending for customer confirmation"),
      (payload.notification.body = `Your sell order (#${orderNumber}) is pending for customer confirmation`);
    payload.data.notificationType = SELLER.PRICE_CHANGE.toString();
  } else if (status == 8) {
    (payload.notification.title = "Rejection reason"),
      (payload.notification.body = `Your sell order (#${orderNumber}) Rejected. Rejection reason is ${notificationData.rejectionReason} `);
    payload.data.notificationType == SELLER.REJECTION_REASON.toString();
  }

  // Notification store
  await Notification.create({
    status: notificationData.status,
    userId: notificationData.auth,
    orderId: notificationData.orderId,
    isBuySell: 1,
    notificationType: notificationData.notificationType,
    title: payload.notification.title,
    description: payload.notification.body,
    itemId: notificationData.itemId ? notificationData.itemId : null,
    rejectionReason: notificationData.rejectionReason
      ? notificationData.rejectionReason
      : null,
  });

  console.log("send Notification....");
  console.log(payload, "Selling order payload");
  
  await FcmHelper.sendPushNotification(tokens, payload);
};

/**
 * @description: Send push notification foe ride
 * @param {*} status
 * @param {*} id
 * @returns
 */
export const sendPushNotificationSuperAdmin = async (notificationData) => {
  const tokens = [];
  (await FcmStore.find({ userId: notificationData.auth, userType: 2 })).forEach(function (
    document
  ) {
    tokens.push(document.token);
  });

  const payload = {
    notification: {
      title: "",
      body: "",
    },
    data: {
      ...notificationData,
    },
  };

  let status = notificationData.status;
  let orderNumber = notificationData.orderNumber;

  if (status == 1) {
    (payload.notification.title = "Order Placed"),
      (payload.notification.body = `A new buy order (#${orderNumber}) has been placed and awaits processing.`);
    payload.data.notificationType = SUPERADMIN.BUYER.ORDERPLACED.toString();
  } else if (status == 2) {
    (payload.notification.title = "Payment Confirmed"),
      (payload.notification.body = `Payment for buy order (#${orderNumber}) processed successfully.`);
    payload.data.notificationType = SUPERADMIN.BUYER.PAYMENTCONFIRM.toString();
  } else if (status == 3) {
    (payload.notification.title = "Cancelled"),
      (payload.notification.body = `Buy order (#${orderNumber}) cancelled. Refund process initiated.`);
    payload.data.notificationType = SUPERADMIN.BUYER.CANCELLED.toString();
  } else if (status == 4) {
    (payload.notification.title = "Returned/Exchange Requested"),
      (payload.notification.body = `Return/Exchange request for buy order (#${orderNumber}) noted. Further details pending.`);
    payload.data.notificationType = SUPERADMIN.BUYER.EXCHANGEREQUEST.toString();
  } else if (status == 5) {
    (payload.notification.title = "New Sell Order Submission"),
      (payload.notification.body = `A new sell order (#${orderNumber}) has been submitted and is pending review.`);
    payload.data.notificationType = SUPERADMIN.SELLER.SUBMITTED.toString();
  } else if (status == 6) {
    (payload.notification.title = "Accept Price Request"),
      (payload.notification.body = `A sell order (#${orderNumber}) change price request has been accepted.`);
    payload.data.notificationType = SUPERADMIN.ACCEPT_PRICE_REQUEST.toString();
  } else if (status == 7) {
    (payload.notification.title = "Reject Price Request"),
      (payload.notification.body = `A sell order (#${orderNumber}) change price request has been rejected.`);
    payload.data.notificationType = SUPERADMIN.REJECT_PRICE_REQUEST.toString();
  }

  // Notification store
  await Notification.create({
    status: notificationData.status,
    superAdminId: notificationData.auth,
    orderId: notificationData.orderId,
    isBuySell: 1,
    notificationType: notificationData.notificationType,
    title: payload.notification.title,
    description: payload.notification.body,
    itemId: notificationData.itemId ? notificationData.itemId : null,
    rejectionReason: notificationData.rejectionReason
      ? notificationData.rejectionReason
      : null,
  });

  console.log(payload, "Super admin payload");

  await FcmHelper.sendPushNotification(tokens, payload);
};

/**
 * @description: Change selling order status
 */
export const changeSellingOrderStatus = async (orderId) => {
  const findOrder = await SellItems.findById(orderId);

  if (!findOrder) {
    throw new NotFoundException("Order not found");
  }

  const allItems = findOrder.sellingItems;

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

  return statusUpdatedValue;
};

/**
 * @description : Set selling order total price and total document
 * @param {*} orderId
 */
export const setSellingOrderTotalPrice = async (orderId) => {
  const findOrder = await SellItems.findById(orderId).populate(
    "sellingItems.itemId"
  );

  if (!findOrder) {
    throw new NotFoundException("Order not found");
  }

  const allItems = findOrder.sellingItems;

  let totalItems = 0;
  let totalAmount = 0;

  allItems.forEach((item) => {
    const price = parseFloat(item.itemId.price);
    if (!isNaN(price)) {
      totalItems += 1;
      totalAmount += price;
    }
  });

  console.log(`Total Items: ${totalItems}`);
  console.log(`Total Amount: ${totalAmount}`);

  return { totalItems, totalAmount };
};
