import path from "path";
import fs from "fs";
import RegisterResource from "../auth/resources/registerResource";
import commonService from "../../../utils/commonService";
import Users from "../../../model/users";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import { createUserLog } from "../../common/helper";



class usersServices {

    /**
      * @description: Users profile get
      * @param {*} auth 
      */
    static async usersProfileGet(auth) {
        const findUser = await commonService.findOne(Users, { _id: auth });
        if (!findUser) {
            throw new NotFoundException("User not found");
        } else {
            return { ...new RegisterResource(findUser) }
        }
    }


    /**
      * @description: Edit-Profile
      * @param {*} data 
      * @param {*} auth 
      * @param {*} file 
      * @param {*} req 
      * @param {*} res 
      */
    static async editProfile(auth, data, file, req, res) {
        const { fullName, email, countryCode, phone } = data;

        if (file) {
            const profile = `usersProfile/${file.filename}`;

            const findUser = await commonService.findById(Users, { _id: auth });

            if (findUser) {
                try {
                    await fs.unlinkSync(path.join(__dirname, '../../../public/', findUser.image));
                } catch (err) {
                    await commonService.updateById(Users, auth, {
                        fullName: fullName,
                        email: email,
                        countryCode: countryCode,
                        phone: phone,
                        image: profile
                    });
                }

                const userUpdate = await commonService.updateById(Users, auth, {
                    fullName: fullName,
                    email: email,
                    countryCode: countryCode,
                    phone: phone,
                    image: profile
                });

                createUserLog(auth, req.ip, "Edit Profile", "User update their profile")

                return { ...new RegisterResource(userUpdate) }
            } else {
                throw new BadRequestException("This user not found")
            }
        } else {
            const findUser = await commonService.findById(Users, { _id: auth });

            const profile = findUser.image !== null ? findUser.image : null;
            const userUpdate = await commonService.updateById(Users, auth, {
                fullName: fullName,
                email: email,
                countryCode: countryCode,
                phone: phone,
                image: profile
            });

            createUserLog(auth, req.ip, "Edit Profile", "User update their profile")

            return { ...new RegisterResource(userUpdate) }
        }

    }

}



export default usersServices;