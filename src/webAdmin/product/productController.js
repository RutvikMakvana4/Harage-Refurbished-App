import productServices from "./productServices";

class productController {
    /**
     * @description: add Product page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addProductPage(req, res) {
        await productServices.addProductPage(req, res);
    }

    /**
     * @description : add product form
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async addProduct(req, res) {
        const data = await productServices.addProduct(req.body, req.files, req, res);
        return res.send(data);
    }

    /**
     * @description:  Product list page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async productListPage(req, res) {
        await productServices.productListPage(req, res);
    }

    /**
     * @description : product list
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async productList(req, res) {
        const data = await productServices.productList(req.query, req, res);
    }

    /**
     * @description: Draft product page 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async draftProductListPage(req, res) {
        await productServices.draftProductListPage(req, res);
    }

    /**
     * @description : Draft product list
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async draftProductList(req, res) {
        const data = await productServices.draftProductList(req.query, req, res);
    }

    /**
     * @description:  Product list page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async viewProductDetailPage(req, res) {
        await productServices.viewProductDetailPage(req, res);
    }

    /**
     * @description : product form
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async viewProductDetail(req, res) {
        const data = await productServices.viewProductDetail(req.params.id, req, res);
    }

    /**
   * @description: delete Products
   * @param {*} req 
   * @param {*} res 
   */
    static async deleteProducts(req, res) {
        const data = await productServices.deleteProducts(req.params.id, req, res);
        res.send(data)
    }

    /**
     * @description: Delete Item Images
     * @param {*} req
     * @param {*} res
     */
    static async deleteImage(req, res) {
        const data = await productServices.deleteImage(req.params.id, req, res);
        return res.send({ message: "Image deleted" })
    }

    /**
    * @description: Update product page
    * @param {*} req 
    * @param {*} res 
    */
    static async updateProductPage(req, res) {
        await productServices.upadateProductPage(req.params.id, req, res);
    }

    /**
     * @description: Update product details
     * @param {*} req 
     * @param {*} res 
     */
    static async updateProduct(req, res) {
        const data = await productServices.updateProduct(req.params.id, req.body, req.files, req, res);
        res.send(data);
    }


}

export default productController;