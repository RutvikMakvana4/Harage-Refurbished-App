import SaveHistory from "../../../model/saveHistory";

class saveServices {
    /**
     * @description: Save keywords
     * @param {*} query 
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async saveKeywords(query, auth, req, res) {
        try {
            const { type } = query;
            const assignRoles = req.user ? req.user.assignRoles : [];
            let updateField;

            switch (type) {
                case "1":
                    updateField = "saveProductsKeywords";
                    break;
                case "2":
                    updateField = "saveUsersKeywords";
                    break;
                case "3":
                    updateField = "saveAdminsKeywords";
                    break;
                case "4":
                    updateField = "saveQuickSellOrderKeywords";
                    break;
                case "5":
                    updateField = "savePurchasedOrderKeywords";
                    break;
                case "6":
                    updateField = "saveDraftProductsKeywords";
                    break;
                default:
                    throw new Error("Invalid type");
            }

            const data = await SaveHistory.findOneAndUpdate(
                {
                    adminId: auth.id,
                    role: assignRoles,
                },
                {
                    $push: { [updateField]: query[updateField] },
                },
                {
                    upsert: true,
                    new: true,
                }
            );

            return { data };
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description: Get last five Save keywords
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async listOfsaveKeywords(query, auth, req, res) {
        const type = query.type;

        try {
            const saveHistory = await SaveHistory.findOne({ adminId: auth.id, role: auth.assignRoles });
            let lastFiveKeywords = [];

            if (type === "1") {
                lastFiveKeywords = saveHistory?.saveProductsKeywords;
            } else if (type === "2") {
                lastFiveKeywords = saveHistory?.saveUsersKeywords;
            } else if (type === "3") {
                lastFiveKeywords = saveHistory?.saveAdminsKeywords;
            } else if (type === "4") {
                lastFiveKeywords = saveHistory?.saveQuickSellOrderKeywords;
            } else if (type === "5") {
                lastFiveKeywords = saveHistory?.savePurchasedOrderKeywords;
            } else if (type === "6") {
                lastFiveKeywords = saveHistory?.saveDraftProductsKeywords;
            } else {
                throw new Error("Invalid type");
            }

            return lastFiveKeywords?.slice(-5).reverse() || [];

        } catch (error) {
            console.log(error);
        }
    }
}

export default saveServices;