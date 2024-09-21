import returnExchangeServices from "./returnExchangeServices";

class returnExchangeController {

    /**
     * @description: Return/Exchange product request list page
     * @param {*} req 
     * @param {*} res 
     */
    static async returnOrExchangeProductListPage(req, res) {
        await returnExchangeServices.returnOrExchangeProductListPage(req, res);
    }

    /**
     * @description: Return/Exchange product request list
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async returnOrExchangeProductList(req, res) {
        await returnExchangeServices.returnOrExchangeProductList(req.query, req, res);
    }

}

export default returnExchangeController;