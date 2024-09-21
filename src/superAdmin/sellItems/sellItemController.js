import { Message } from "twilio/lib/twiml/MessagingResponse";
import sellItemsServices from "./sellItemServices";

class sellItemsController {
  /**
   * @description: History of all selling order
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async sellingHistory(req, res) {
    const { data, meta } = await sellItemsServices.sellingHistory(
      req.query,
      req.user,
      req,
      res
    );
    return res.send({ data: data, meta: meta });
  }

  /**
   * Order full details
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async orderFullDetails(req, res) {
    const data = await sellItemsServices.orderFullDetails(req.query, req, res);
    return res.send({ data: data });
  }

  /**
   * @description: assign member for particular orders
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async assignMember(req, res) {
    await sellItemsServices.assignMember(req.query, req, res);
    return res.send({ message: "Member Assigned successfully" });
  }

  /**
   * @description: Update order status
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async updateOrderStatus(req, res) {
    await sellItemsServices.updateOrderStatus(req.query, req, res);
    return res.send({ message: "Update status successfully" });
  }

  /**
   * @description: Update order items status
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async updateOrderItemsStatus(req, res) {
    await sellItemsServices.updateOrderItemsStatus(req.query, req, res);
    return res.send({ message: "Update status successfully" });
  }

  /**
   * @description: Send price change request
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async sendPriceRequest(req, res) {
    await sellItemsServices.sendPriceRequest(req.query, req, res);
    return res.send({ message: "Send price change request successfully" });
  }

  /**
   * @description: Send rejection reason
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async sendRejectionReason(req, res) {
    await sellItemsServices.sendRejectionReason(req.query, req, res);
    return res.send({ message: "Send rejection reason successfully" });
  }

  /**
   * @description: item details
   * @param {*} req
   * @param {*} res
   */
  static async itemDetails(req, res) {
    const { data } = await sellItemsServices.itemDetails(req.query, req, res);
    return res.send({ data: data });
  }
}

export default sellItemsController;
