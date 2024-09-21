
import addressServices from "./addressServices";
import OneAddressResource from "./resources/oneAddressResource";


class addressController {

    /**
     * @description: Add Address
     * @param {*} req 
     * @param {*} res 
     */
    static async addAddress(req, res) {
        const data = await addressServices.addAddress(req.body, req.user, req, res);
        return res.send({ message: "Address add successfully", data });
    }


    /**
     * @description: Edit Address
     * @param {*} req 
     * @param {*} res 
     */
    static async editAddress(req, res) {
        const data = await addressServices.editAddress(req.params.id, req.body, req, res);
        return res.send({ message: "Address update successfully", data });
    }


    /**
     * @description: delete Address
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteAddress(req, res) {
        const data = await addressServices.deleteAddress(req.params.id, req.user, req, res);
        return res.send({ message: "Address delete successfully" })
    }



    /**
     * @description: Address List
     * @param {*} req 
     * @param {*} res 
     */
    static async addressList(req, res) {
        const data = await addressServices.addressList(req.user, req, res);
        return res.send({ data })
    }

    /**
      * @description: Set default Address select
      * @param {*} req 
      * @param {*} res 
      */
    static async setDefaultAddress(req, res) {
        const data = await addressServices.setDefaultAddress(req.user, req.params.id, req, res);
        return res.send({ message: "Address set deafult successfully" });
    }

    /**
     * @description:  get default address
     * @param {*} req
     * @param {*} res
    */
    static async getDefaultAddress(req, res) {
        const data = await addressServices.getDefaultAddress(req.user, req, res);
        return res.send({ data: data ? new OneAddressResource(data) : {} });
    }

}

export default addressController;