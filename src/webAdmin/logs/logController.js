import logServices from "./logServices";

class logController {
    /**
     * @description: User logs page load
     * @param {*} req 
     * @param {*} res 
     */
    static async userLogsPage(req, res) {
        await logServices.userLogsPage(req, res);
    }



    /**
     * @description: View user logs
     * @param {*} req 
     * @param {*} res 
     */
    static async viewUserLogs(req, res) {
        await logServices.viewUserLogs(req.query, req, res)
    }

    /**
     * @description: Admin logs page load
     * @param {*} req 
     * @param {*} res 
     */
    static async adminLogsPage(req, res) {
        await logServices.adminLogsPage(req, res);
    }

    /**
     * @description: View admin logs
     * @param {*} req 
     * @param {*} res 
     */
    static async viewAdminLogs(req, res) {
        await logServices.viewAdminLogs(req.query, req, res)
    }
}

export default logController;