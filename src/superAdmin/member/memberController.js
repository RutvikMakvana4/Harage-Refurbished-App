import memberServices from "./memberServices";

class memberController {

    /**
    * @description: All Members List
    * @param {*} req 
    * @param {*} res 
    */
    static async memberList(req, res) {
        const { data, meta } = await memberServices.memberList(req.query, req, res);
        return res.send({ data: data, meta: meta });
    }
}

export default memberController;

