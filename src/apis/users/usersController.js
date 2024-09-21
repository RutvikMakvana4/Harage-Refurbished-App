import usersServices from "./usersServices";

class usersController {
    /**
     * @description: Users profile get
     * @param {*} req 
     * @param {*} res 
     */
    static async usersProfileGet(req, res) {
        const data = await usersServices.usersProfileGet(req.user);
        return res.send({ data })
    }


    /**
     * @description: Users profile update
     * @param {*} req 
     * @param {*} res 
     */
    static async editProfile(req, res) {
        const data = await usersServices.editProfile(req.user, req.body, req.file, req, res);
        return res.send({ message: "Profile updated successfully", data });
    }

}

export default usersController;