import itemServices from "./itemsServices";

class itemController {
    /**
     * @description: add quick sell items
     * @param {*} req 
     * @param {*} res 
     */
    static async addItems(req, res) {
        const data = await itemServices.addItems(req.body, req.user, req.files, req, res);
        return res.send({ message: "Add items successfully", data });
    }


    /**
     * @description: quick sell list items
     * @param {*} req 
     * @param {*} res 
     */
    static async addItemList(req, res) {
        const { data, MRP, totalAmount } = await itemServices.addItemList(req.user, req, res);
        return res.send({ data: data, MRP, totalAmount });
    }

    /**
    * @description: Get one item details
    * @param {*} req 
    * @param {*} res 
    */
    static async getItemDetails(req, res) {
        const { data } = await itemServices.getItemDetails(req.params.id, req, res);
        return res.send({ data: data });
    }

    /**
     * @description: Edit Item
     * @param {*} req 
     * @param {*} res 
     */
    static async editItem(req, res) {
        const data = await itemServices.editItem(req.params.id, req.body, req.files, req, res);
        return res.send({ message: "Items update successfully" });
    }

    /**
     * @description: Delete Item Images
     * @param {*} req
     * @param {*} res
     */
    static async deleteItemImage(req, res) {
        const data = await itemServices.deleteItemImage(req.params.ids, req, res);
        return res.send({ message: "Image deleted" })
    }

    /**
     * @description: delete Item
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteItem(req, res) {
        const { data, MRP, totalAmount } = await itemServices.deleteItem(req.params.id, req.user, req, res);
        return res.send({ data: data, MRP, totalAmount });
    }

    /**
     * @description: Send notification for quick sell ietms
     * @param {*} req 
     * @param {*} res 
     */
    static async sendNow(req, res) {
        const data = await itemServices.sendNow(req.params.id, req.user, req.query, req, res);
        return res.send({ message: "Product selling sent successfully" });
    }

     /**
     * @description: Accept/Reject Price Request
     * @param {*} req 
     * @param {*} res 
     */
    static async acceptRejectPrice(req, res) {
        await itemServices.acceptRejectPrice(req.user, req.query, req, res);
    }
}

export default itemController;
