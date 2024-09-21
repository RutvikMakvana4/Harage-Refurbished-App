import homeServices from "./homeServices";

class homeController {

    /**
     * @description : Home page Details
     * @param {*} req
     * @param {*} res
     */
    static async homePage(req, res) {
        await homeServices.homePage(req.user, req, res);
    }

    /**
     * @description : search product
     * @param {*} req
     * @param {*} res
     */
    static async search(req, res) {
        const { data, meta } = await homeServices.search(req.query, req, res);
        return res.send({ data: data, meta: meta })
    }

    /**
     * @description : Product price under $1000
     * @param {*} req
     * @param {*} res
     */
    static async priceListing(req, res) {
        const { data, meta } = await homeServices.priceListing(req.query, req, res);
        return res.send({ data: data, meta: meta  });
    }

    /**
     * @description : Product price under $99
     * @param {*} req
     * @param {*} res
     */
    static async priceUnder99(req, res) {
        const data = await homeServices.priceUnder99(req.user, req, res);
        return res.send({ message: "All products price is under $99", data });
    }
}

export default homeController;