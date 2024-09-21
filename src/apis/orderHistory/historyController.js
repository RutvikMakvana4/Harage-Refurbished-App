import historyServices from "./historyServices";

class historyController {

    /**
     * @description: History of all selling order
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async orderHistory(req, res) {
        const { data, meta } = await historyServices.orderHistory(req.query, req.user, req, res);
        return res.send({ data: data, meta: meta })
    }

    /**
     * @description: History of selling order in details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async orderHistoryDetails(req, res) {
        const data = await historyServices.orderHistoryDetails(req.params.id, req.query, req.user, req, res);
        return res.send({ data: data })
    }

    /**
     * @description: Selling Order item detail action
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async itemDetailAction(req, res) {
        const data = await historyServices.itemDetailAction(req.params.id, req, res);
        return res.send({ data: data })
    }

    /**
     * @description: Delete sell items in order history list 
     * @param {*} req 
     * @param {*} res
     * @returns 
     */
    static async sellingItemDelete(req, res) {
        const data = await historyServices.sellingItemDelete(req.params.id, req.user, req, res);
        return res.send({ message: "Item delete successfully from your order list" })
    }

    /**
     * @description: Download invoice for orders 
     * @param {*} req 
     * @param {*} res
     * @returns 
     */
    static async invoiceDownload(req, res) {
        await historyServices.invoiceDownload(req.params.id, req.query, req.user, req, res);
    }

}

export default historyController;