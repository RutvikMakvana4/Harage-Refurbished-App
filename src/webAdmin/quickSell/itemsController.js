import itemServices from "./itemsServices";

class itemController {
  /**
   * @description: User quick sell items page load
   * @param {*} req
   * @param {*} res
   */
  static async quickSellPage(req, res) {
    await itemServices.quickSellPage(req, res);
  }

  /**
   * @description: history of all selling order
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async quickSellList(req, res) {
    await itemServices.quickSellList(req.query, req, res);
  }

  /**
   * @description : Quick sell item details
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async viewProductDetail(req, res) {
    const data = await itemServices.viewProductDetail(req.params.id, req, res);
  }

  /**
   * @description : update status of quick sell order`s
   * @param {*} req
   * @param {*} res
   */
  static async updateStatus(req, res) {
    const data = await itemServices.updateStatus(
      req.params.id,
      req.body,
      req.user,
      req,
      res
    );
    return res.send(data);
  }

  /**
   * @description : update item status
   * @param {*} req
   * @param {*} res
   */
  static async updateItemStatus(req, res) {
    const data = await itemServices.updateItemStatus(
      req.params.id,
      req.body,
      req.user,
      req,
      res
    );
  }

  /**
   * @description: Send price change request
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async sendPriceRequest(req, res) {
    await itemServices.sendPriceRequest(req.body, req, res);
    return res.send({ message: "send price change request successfully" });
  }

  /**
   * @description: Send rejection reason
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async sendRejectionReason(req, res) {
    await itemServices.sendRejectionReason(req.body, req, res);
    return res.send({ message: "send rejection reason successfully" });
  }

  /**
   * @description: Send for confirmation
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async sendForConfirmation(req, res) {
    await itemServices.sendForConfirmation(req.query, req.body, req, res);
    return res.send({ message: "send request successfully" });
  }
}

export default itemController;
