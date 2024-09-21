import SubAdmin from "../../../model/subAdmin";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { BCRYPT } from "../../common/constants/constants";
import { sendMail } from "../../common/sendEmail";

class adminServices {

    /**
     * @description: product list page load
     * @param {*} req 
     * @param {*} res 
     */
    static async adminListPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/admins/adminListing', { assignRoles });
    }

    /**
     * @description: product list
     * @param {*} req 
     * @param {*} res 
     */
    static async adminList(query, req, res) {
        const { start, length, search, draw } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = { $or: [{ "fullName": { $regex: search_value, $options: 'i' } }, { "email": { $regex: search_value, $options: 'i' } }, { "assignRoles": { $regex: search_value, $options: 'i' } }] };

        const data = await SubAdmin.find(search_value ? search_query : {}).skip(page).limit(limit).sort({ createdAt: -1 });
        const count = await SubAdmin.find({}).count()

        return res.send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: count,
            aaData: data
        });
    }

    /**
     * @description: add product page load
     * @param {*} req 
     * @param {*} res 
     */
    static async addAdminPage(req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        return res.render('webAdmin/admins/addAdmin', { assignRoles });
    }


    /**
    * @description: add admin
    * @param {*} data 
    * @param {*} files 
    * @param {*} req 
    * @param {*} res 
    * @returns 
    */
    static async addAdmin(data, file, req, res) {
        try {
            const { fullName, email, password, assignRoles } = data;
            const existingUser = await SubAdmin.findOne({ email: email });

            if (existingUser) {
                return res.redirect('back');
            }

            const profile = file ? `adminImages/${file.filename}` : null;
            const hashPass = await bcrypt.hash(password, BCRYPT.SALT_ROUND);

            const newAdmin = await SubAdmin.create({
                fullName,
                email,
                password: hashPass,
                image: profile,
                assignRoles,
            });

            const appLink = `${process.env.APP_URL_ADMIN}/webAdmin/login`
            const obj = {
                to: email,
                subject: `Your Credentials for ${process.env.APP_NAME}`,
                data: { assignRoles, email, password, appLink }
            }

            sendMail(obj, 'adminCredentialsMail');

            return res.redirect('/webAdmin/admin/admin-page');
        }
        catch (err) {
            console.log(err)
        }
    }

    /**
     * @description : Delete Admin
     * @param {*} id 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async deleteAdmin(id, req, res) {
        const deleteAdmin = await SubAdmin.findByIdAndDelete(id)
        return res.send({
            ans: deleteAdmin
        })
    }

    /**
     * @description: Update admin page
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async upadateAdminPage(id, req, res) {
        const assignRoles = req.user ? req.user.assignRoles : [];
        const findAdmin = await SubAdmin.findById({ _id: id });
        return res.render('webAdmin/admins/updateAdmin', { admin: findAdmin, assignRoles });
    }

    /**
     * @description: Update admin profile
     * @param {*} data 
     * @param {*} file 
     * @param {*} req 
     * @param {*} res 
     */
    static async updateAdmin(data, file, req, res) {
        const { updateId, fullName, email, password, assignRoles } = data;

        if (file) {

            const findAdminId = await SubAdmin.findById({ _id: updateId });
            const profile = `adminImages/${file.filename}`;

            try {
                await fs.unlinkSync(path.join(__dirname, '../../../public/', findAdminId.image));
            } catch (err) {
                await SubAdmin.findByIdAndUpdate(findAdminId._id, {
                    image: profile
                });
            }
            const hashPass = await bcrypt.hash(password, BCRYPT.SALT_ROUND);

            await SubAdmin.findByIdAndUpdate(findAdminId._id, {
                fullName: fullName,
                email: email,
                password: hashPass,
                image: profile,
                assignRoles: assignRoles
            });

            req.flash('success', 'Admin updated successfully');
            return res.redirect('/webAdmin/admin/admin-page');
        } else {
            const findAdminId = await SubAdmin.findById({ _id: updateId });
            const hashPass = await bcrypt.hash(password, BCRYPT.SALT_ROUND);

            await SubAdmin.findByIdAndUpdate(findAdminId._id, {
                fullName: fullName,
                email: email,
                password: hashPass,
                assignRoles: assignRoles
            });
            req.flash('success', 'Admin updated successfully');
            return res.redirect('/webAdmin/admin/admin-page');
        }
    }


}

export default adminServices;
