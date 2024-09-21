import reportServices from "./reportServices";

class reportController {

    /**
     * @description: Report Product
     * @param {*} req 
     * @param {*} res 
     */
    static async reportProduct(req, res) {
        const data = await reportServices.reportProduct(req.user, req.body, req.files, req, res);
        // return res.send({ message: "Report product successfully", data })
    }



    /**
     * Return report listing
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async reportReturnExchangeList(req, res) {
        const data = await reportServices.reportReturnExchangeList(req.query);
        return res.send({ data: data });
    }

}

export default reportController;