import SuperAdmin from "../../../model/superAdmin";
import bcrypt from "bcrypt"
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import authServices from "../../apis/auth/authServices";
import RegisterResource from "../../apis/auth/resources/registerResource";

class authService {

    /**
     * @description : super admin login
     * @param {*} data 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async login(data, req, res) {
        const { email, password } = data
        const findSuperAdmin = await SuperAdmin.findOne({ email: email })
        if (!findSuperAdmin) throw new NotFoundException("This email id is not found")

        const isPasswordMatch = await bcrypt.compare(password, findSuperAdmin.password);
        if (!isPasswordMatch) throw new BadRequestException("Invalid password")

        const authentication = await authServices.generateTokenPairs(findSuperAdmin._id)
        return { data: new RegisterResource(findSuperAdmin), authentication }
    }

}

export default authService;