import categoryServices from "./categoryServices";

class categoryController {

    /**
     * @description: Get All Catgories
     * @param {*} req 
     * @param {*} res 
     */
    static async allCategories(req, res) {
        const data = await categoryServices.allCategories(req.user, req, res);
        return res.send({ message: "Catgory List", data })
    }



    /**
     * @description: Sub Catgories
     * @param {*} req 
     * @param {*} res 
     */
    static async subCategories(req, res) {
        const data = await categoryServices.subCategories(req.user, req.params.id, req, res);
        return res.send({ message: "Sub-Category List", data })
    }


    /**
     * @description: Sub-Sub-Catgories
     * @param {*} req 
     * @param {*} res 
     */
    static async subSubCategories(req, res) {
        const data = await categoryServices.subSubCategories(req.user, req.params.id, req, res);
        return res.send({ message: "Sub-Sub-Category List", data })
    }


    /**
     * @description: Sub-Sub-Catgories
     * @param {*} req 
     * @param {*} res 
     */
    static async subCategoryList(req, res) {
        const data = await categoryServices.subCategoryList(req.user, req.params.id, req, res);
        return res.send({ data })
    }



}

export default categoryController;