import { NotFoundException } from "../../common/exceptions/errorException";
import Product from "../../../model/product";
import ReturnExchange from "../../../model/returnExchangeRequests";
import BuyOrder from "../../../model/buyOrder";
import {
  isValidObjectId,
  randomNumberGenerator,
  sendPushNotificationBuyOrder,
  sendPushNotificationSuperAdmin,
} from "../../common/helper";
class returnExchangeServices {
  /**
   * @description: Send request for return/Exchange products
   * @param {*} id
   * @param {*} auth
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async returnOrExchangeProduct(query, auth, data, files, req, res) {
    const orderId = query.orderId;
    const productId = query.productId;

    const findOrder = await BuyOrder.findOne({ _id: orderId }).populate(
      "paymentMethod"
    );

    if (!findOrder) {
      throw new NotFoundException("Order not found")
    }

    const findProduct = await Product.findById(productId);

    if (!findProduct) {
      throw new NotFoundException("productId is not correct");
    } else {
      // Images store
      const images = [];
      if (files) {
        files.map(async (image) => {
          images.push(`returnexchange/${image.filename}`);
        });
      }

      await ReturnExchange.create({
        userId: auth,
        productId: productId,
        ...data,
        image: images,
      });

      await Product.findByIdAndUpdate(
        productId,
        {
          status: 6,
        },
        { new: true }
      );

      await sendPushNotificationBuyOrder(
        7,
        findOrder._id,
        auth,
        findOrder.orderId,
        findOrder.paymentMethod.type
      );

    }
  }
}

export default returnExchangeServices;