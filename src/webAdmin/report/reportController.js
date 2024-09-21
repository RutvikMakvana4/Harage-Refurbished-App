import reportServices from "./reportServices";

class reportController {
  /**
   * @description: Report list page
   * @param {*} req
   * @param {*} res
   */
  static async reportListPage(req, res) {
    await reportServices.reportListPage(req, res);
  }

  /**
   * @description: Report list
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async reportList(req, res) {
    await reportServices.reportList(
      req.query,
      req,
      res
    );
  }
}

export default reportController;
