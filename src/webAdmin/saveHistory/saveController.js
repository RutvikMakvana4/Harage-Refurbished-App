import saveServices from "./saveServices";

class saveController {
    /**
     * @description: Save keywords
     * @param {*} req 
     * @param {*} res 
     */
    static async saveKeywords(req, res) {
        await saveServices.saveKeywords(req.query, req.user, req, res);
    }

    /**
     * @description: Get last five Save keywords
     * @param {*} req 
     * @param {*} res 
     */
    static async listOfsaveKeywords(req, res) {
        const data = await saveServices.listOfsaveKeywords(req.query, req.user, req, res);
        return res.send(data);
    }
}

export default saveController;