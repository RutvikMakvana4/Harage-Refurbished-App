import adminServices from "./adminServices";

class productController {

    /**
     * @description: Admin list page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async adminListPage(req, res) {
        await adminServices.adminListPage(req, res);
    }

    /**
     * @description : product list
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async adminList(req, res) {
        const data = await adminServices.adminList(req.query, req, res);
    }

    /**
     * @description: add Admin page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async addAdminPage(req, res) {
        await adminServices.addAdminPage(req, res);
    }

    /**
     * @description : add admin
     * @param {*} req
     * @param {*} res
     * @returns
     */
    static async addAdmin(req, res) {
        const data = await adminServices.addAdmin(req.body, req.file, req, res);
    }

    /**
    * @description: Delete Admin
    * @param {*} req 
    * @param {*} res 
    */
    static async deleteAdmin(req, res) {
        await adminServices.deleteAdmin(req.params.id, req, res)
    }

    /**
     * @description: Update admin page
     * @param {*} req 
     * @param {*} res 
     */
    static async updateAdminPage(req, res) {
        await adminServices.upadateAdminPage(req.params.id, req, res);
    }



    /**
     * @description: Update admin profile
     * @param {*} req 
     * @param {*} res 
     */
    static async updateAdmin(req, res) {
        await adminServices.updateAdmin(req.body, req.file, req, res);
    }

}

export default productController;