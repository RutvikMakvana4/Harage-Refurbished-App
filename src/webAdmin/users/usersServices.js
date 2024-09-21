import Users from "../../../model/users";
import commonService from "../../../utils/commonService";
import Address from "../../../model/address";
import fs from "fs";
import path from "path";

class usersServices {
  /**
   * @description: Users page load
   * @param {*} req
   * @param {*} res
   */
  static async usersPage(req, res) {
    const assignRoles = req.user ? req.user.assignRoles : [];
    return res.render("webAdmin/users/userList", { assignRoles });
  }

  /**
   * @description: View users
   * @param {*} query
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async viewUsers(query, req, res) {
    const { start, length, search, draw } = query;
    const userId = req.params.id;

    if (userId != "all") {
      const data = await Users.find({ _id: userId });

      const results = [];
      for (const user of data) {
        const address = await Address.findOne({
          userId: user._id,
          isDefault: true,
        });
        results.push({ ...user.toObject(), address });
      }

      return res.send({
        draw: draw,
        iTotalRecords: 1,
        iTotalDisplayRecords: 1,
        aaData: results,
      });
    }

    const page = parseInt(start) || 0;
    const limit = parseInt(length) || 10;

    const search_value = search.value;
    const search_query = {
      $or: [
        { fullName: { $regex: search_value, $options: "i" } },
        { email: { $regex: search_value, $options: "i" } },
      ],
    };

    const data = await Users.find(search_value ? search_query : {})
      .skip(page)
      .limit(limit)
      .sort({ createdAt: -1 });
    const count = await Users.find({}).count();

    const results = [];
    for (const user of data) {
      const address = await Address.findOne({
        userId: user._id,
        isDefault: true,
      }); // Assuming each user has a userId field in Address schema
      results.push({ ...user.toObject(), address });
    }

    return res.send({
      draw: draw,
      iTotalRecords: count,
      iTotalDisplayRecords: count,
      aaData: results,
    });
  }

  /**
   * @description : delete users
   * @param {*} id
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async deleteUsers(id, req, res) {
    const deleteUser = await commonService.deleteById(Users, { _id: id });

    return res.send({
      ans: deleteUser,
    });
  }

  /**
   * @description: Update user page
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async upadateUserPage(id, req, res) {
    const assignRoles = req.user ? req.user.assignRoles : [];
    const findUser = await commonService.findById(Users, { _id: id });
    return res.render("webAdmin/users/updateUser", {
      user: findUser,
      assignRoles,
    });
  }

  /**
   * @description: Update user profile
   * @param {*} data
   * @param {*} file
   * @param {*} req
   * @param {*} res
   */
  static async updateUser(data, file, req, res) {
    const { updateId, fullName, email, countryCode, phone } = data;
    if (file) {
      const finsUserId = await commonService.findById(Users, { _id: updateId });
      const profile = `usersProfile/${file.filename}`;
      try {
        await fs.unlinkSync(
          path.join(__dirname, "../../../public/", finsUserId.image)
        );
      } catch (err) {
        await commonService.updateById(Users, finsUserId._id, {
          image: profile,
        });
      }
      await commonService.updateById(Users, finsUserId._id, {
        fullName: fullName,
        email: email,
        countryCode: countryCode,
        phone: phone,
        image: profile,
      });

      req.flash("success", "User updated successfully");
      return res.redirect("/webAdmin/manageUser");
    } else {
      const finsUserId = await commonService.findById(Users, { _id: updateId });

      await commonService.updateById(Users, finsUserId._id, {
        fullName: fullName,
        email: email,
        countryCode: countryCode,
        phone: phone,
      });

      req.flash("success", "User updated successfully");
      return res.redirect("/webAdmin/manageUser");
    }
  }

  /**
   * @description : apporved by admin
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async appovedUser(id, req, res) {
    const findUser = await Users.findById({ _id: id });

    if (findUser) {
      await Users.findByIdAndUpdate(findUser._id, { isApproved: true });
      req.flash("success", "User approved");
    } else {
      req.flash("error", "User not found!");
    }
  }
}

export default usersServices;
