import stripeServices from "./stripeServices";
import SingleCardResource from "./resources/singleCardResources";
import CardsResource from "./resources/stripeCardsResources";

class stripeController {
    /**
     * @description: Create card in stripe
     * @param {*} req 
     * @param {*} res 
     */
    static async createCard(req, res) {
        const data = await stripeServices.createCard(req.user, req.body, req, res);
        return res.send({ message: "Card added successfully", data: new SingleCardResource(data) });
    }


    /**
     * @description: all card list
     * @param {*} req 
     * @param {*} res 
     */
    static async cardList(req, res) {
        const data = await stripeServices.cardList(req.user, req.body, req, res);
        return res.send({ data: new CardsResource(data) });
    }

    /**
    * @description: Delete card info 
    * @param {*} req 
    * @param {*} res 
    */
    static async deleteCardInfo(req, res) {
        const data = await stripeServices.deleteCardInfo(req.user, req.params.id, req, res);
        return res.send({ message: "Card deleted successfully" })
    }

    /**
     * @description: Edit card info
     * @param {*} req 
     * @param {*} res 
     */
    static async editCardInfo(req, res) {
        const data = await stripeServices.editCardInfo(req.user, req.params.id, req.body, req, res);
        return res.send({ message: "Card updated successfully", data: new SingleCardResource(data) })
    }

    /**
     * @description: Set default card select
     * @param {*} req 
     * @param {*} res 
     */
    static async setDefaultCard(req, res) {
        const data = await stripeServices.setDefaultCard(req.user, req.params.id, req, res);
        return res.send({ message: "Card selected successfully" });
    }

    /**
    * @description: Create charge for payment
    * @param {*} req 
    * @param {*} res 
    */
    static async createCharge(req, res) {
        const data = await stripeServices.createCharge(req.params.id, req.user, req, res);
        return res.send({ message: "Congrats! your payment done successfully" })
    }

}

export default stripeController;