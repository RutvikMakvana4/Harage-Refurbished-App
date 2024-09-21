import Users from "../../../model/users";
import Product from "../../../model/product";
import SellItems from "../../../model/sellingItems";
import SubAdmin from "../../../model/subAdmin";
import BuyOrder from "../../../model/buyOrder";

class dashboardController {
    /**
     * @description: Dashboard
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async dashboard(req, res) {

        const assignRoles = req.user ? req.user.assignRoles : [];

        const users = await Users.find({}).count();
        const products = await Product.find({ isSaveDraft: false }).count();
        const draftProducts = await Product.find({ isSaveDraft: true }).count();
        const quickSellOrders = await SellItems.find({ isSelling: true }).count();
        const subAdmins = await SubAdmin.find({}).count();
        const purchasedOrders = await BuyOrder.find({ isBuying: true }).count();

        return res.render("webAdmin/dashboard", { assignRoles, "users": users, "products": products, "draftProducts": draftProducts, "sellOrders": quickSellOrders, "subAdmins": subAdmins, "purchasedOrders": purchasedOrders });
    }

}

export default dashboardController;