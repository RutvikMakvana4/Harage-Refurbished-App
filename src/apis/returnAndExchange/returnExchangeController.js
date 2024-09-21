import returnExchangeServices from "./returnExchangeServices";

class returnExchangeController {

    /**
     * @description: Send request for return/Exchange products
     * @param {*} req 
     * @param {*} res 
     */
    static async returnOrExchangeProduct(req, res) {
        const data = await returnExchangeServices.returnOrExchangeProduct(req.query, req.user, req.body, req.files, req, res);
        return res.send({ message: "Your request sent successfully", data })
    }

}

export default returnExchangeController;