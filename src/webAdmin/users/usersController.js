import usersServices from "./usersServices";

class usersController {
    /**
     * @description: User page load
     * @param {*} req 
     * @param {*} res 
     */
    static async usersPage(req, res) {
        await usersServices.usersPage(req, res);
    }



    /**
     * @description: View users
     * @param {*} req 
     * @param {*} res 
     */
    static async viewUsers(req, res) {
        await usersServices.viewUsers(req.query, req, res)
    }


    /**
    * @description: delete Users
    * @param {*} req 
    * @param {*} res 
    */
    static async deleteUsers(req, res) {
        await usersServices.deleteUsers(req.params.id, req, res)
    }

    /**
     * @description: Update user page
     * @param {*} req 
     * @param {*} res 
     */
    static async updateUserPage(req, res) {
        await usersServices.upadateUserPage(req.params.id, req, res);
    }



    /**
     * @description: Update user profile
     * @param {*} req 
     * @param {*} res 
     */
    static async updateUser(req, res) {
        await usersServices.updateUser(req.body, req.file, req, res);
    }

    /**
     * @description: user approved by admin
     * @param {*} req 
     * @param {*} res 
     */
    static async appovedUser(req, res) {
        await usersServices.appovedUser(req.params.id, req, res);
    }

}

export default usersController;