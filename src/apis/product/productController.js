import productServices from "./productServices";

class productController {
    /**
     * @description: Add Product
     * @param {*} req 
     * @param {*} res 
     */
    static async addProducts(req, res) {
        const data = await productServices.addProducts(req.body, req.user, req.files, req, res);
        return res.send({ message: "Add Product successfully", data });
    }

    /**
     * @description: All Products List
     * @param {*} req 
     * @param {*} res 
     */
    static async allProducts(req, res) {
        const { data, meta } = await productServices.allProducts(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }


    /**
    * @description: find all products based on sub category and sub sub-category
    * @param {*} req 
    * @param {*} res 
    */
    static async findProducts(req, res) {
        const { data, meta } = await productServices.findProducts(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }

    /**
    * @description: Get one product details
    * @param {*} req 
    * @param {*} res 
    */
    static async productDetails(req, res) {
        const { data } = await productServices.productDetails(req.params.id, req.query, req.user, req, res);
        return res.send({ data });
    }


    /**
     * @description: Delete Product Images
     * @param {*} req
     * @param {*} res
     */
    static async deleteProductImage(req, res) {
        const data = await productServices.deleteProductImage(req.params.id, req, res);
        return res.send({ message: "Image deleted" })
    }

    /**
     * @description: delete product
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteProduct(req, res) {
        const data = await productServices.deleteProduct(req.params.id, req, res);
        return res.send({ message: "Product delete successfully" })
    }

    /**
     * @description: Available products details
     * @param {*} req 
     * @param {*} res 
     */
    static async availableDetails(req, res) {
        const { requiredFields, availableData } = await productServices.availableDetails(req.query, req, res);
        return res.send({ data: requiredFields, availableData: availableData })
    }

    /**
     * @description: Apply Filter
     * @param {*} req 
     * @param {*} res 
     */
    static async applyFilter(req, res) {
        const { data, meta } = await productServices.applyFilter(req.query, req.body, req, res);
        return res.send({ data: data.products, meta: meta });
    }

}

export default productController;
