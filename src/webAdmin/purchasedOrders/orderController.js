import orderServices from "./orderServices";

class orderController {


    /**
     * @description: User purchased order page load
     * @param {*} req 
     * @param {*} res 
     */
    static async purchasedOrderPage(req, res) {
        await orderServices.purchasedOrderPage(req, res);
    }

    /**
     * @description: Purchased orders list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async purchasedOrderList(req, res) {
        await orderServices.purchasedOrderList(req.query, req, res);

    }

    /**
     * @description : order products details
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async viewProductDetail(req, res) {
        const data = await orderServices.viewProductDetail(req.params.id, req, res);
    }

    /**
     * @description : Update status of purchased order's
     * @param {*} req
     * @param {*} res
     */
    static async updateStatus(req, res) {
        const data = await orderServices.updateStatus(req.params.id, req.body, req, res);
        return res.send(data);
    }

}

export default orderController;
