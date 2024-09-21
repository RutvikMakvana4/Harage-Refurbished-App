import cartServices from "./cartServices";

class cartController {

    /**
     * @description: Add to Cart
     * @param {*} req 
     * @param {*} res 
     */
    static async addToCart(req, res) {
        const data = await cartServices.addToCart(req.params.id, req.user, req, res);
        return res.send({ message: "Add product in the cart", cartItems: data });
    }


    /**
     * @description: Get Cart Products
     * @param {*} req 
     * @param {*} res 
     */
    static async getCartProducts(req, res) {
        const { data, totalMRP, totalAmount } = await cartServices.getCartProducts(req.user, req, res);
        return res.send({ data, totalMRP, totalAmount });
    }


    /**
     * @description: Remove products from cart
     * @param {*} req 
     * @param {*} res 
     */
    static async removeProduct(req, res) {
        const data = await cartServices.removeProduct(req.params.id, req.user, req, res);
        return res.send({ message: "Product remove successfully", cartItems: data });
    }

    /**
     * @description: buy now
     * @param {*} req 
     * @param {*} res 
     */
    static async buyNow(req, res) {
        const data = await cartServices.buyNow(req.params.id, req.user, req, res);
        return res.send({ message: "success" });
    }

    /**
      * @description: checkout
      * @param {*} req 
      * @param {*} res 
      */
    static async checkout(req, res) {
        const data = await cartServices.checkout(req.query, req.user, req, res);
        return res.send({ message: "Checkout for payment", data: data ? data : null });
    }

    /**
     * @description : Pay now
     * @param {*} req
     * @param {*} res 
     */
    static async payNow(req, res) {
        const data = await cartServices.payNow(req.params.id, req.query, req.user, req, res);
        // return res.send({ message: "Your order has been successfully placed.", data });
    }


    /**
     * Payment success
     * @param {*} req 
     * @param {*} res 
     */
    static async skipcashPaymentSuccess(req, res) {
        await cartServices.skipcashPaymentSuccess(req, res);
    }


    /**
     * purchase product list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async purchaseOrderDeteils(req, res) {
        const data = await cartServices.purchaseOrderDeteils(req.user, req.params.id, res, res);
        return res.send(data);
    }



    /**
     * @description : Order all products list
     * @param {*} req
     * @param {*} res 
     */
    static async orderProducts(req, res) {
        const data = await cartServices.orderProducts(req.params.id, req.user, req, res);
        return res.send({ data: data.orderDetails });
    }

    /**
     * @description : track order
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async trackOrder(req, res) {
        const data = await cartServices.trackOrder(req.query, req.user, req, res);
        return res.send({ data });
    }

    /**
     * @description : Cancel order
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async cancelOrder(req, res) {
        await cartServices.cancelOrder(req.params.id, req.user, req, res);
        return res.send({ message: 'Order cancelled successfully' });
    }




    /**
     * Refund
     * @param {*} req 
     * @param {*} res 
     */
    static async skipcashRefundAmount(req, res) {
        await cartServices.skipcashRefundAmount(req.params.id, req, res);
    }
}

export default cartController;
