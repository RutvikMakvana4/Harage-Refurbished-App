import mongoose from "mongoose";
import { BadRequestException, NotFoundException } from "../../common/exceptions/errorException";
import OrderReview from "../../../model/orderReview";
import BuyOrder from "../../../model/buyOrder";

class reviewServices {

    /**
     * @description: Order review
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     */
    static async orderReview(id, auth, data, req, res) {
        
        // try {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const findOrder = await BuyOrder.findById({ _id: id })
    
                if (findOrder) {
                    await OrderReview.create({
                        userId: auth,
                        orderId: findOrder._id,
                        writeYourExperience: data.writeYourExperience
                    })
                } else {
                    throw new NotFoundException("Order is not found");
                }
            } else {
                throw new BadRequestException("Please enter correct order Id");
            }
        // } catch (error) {
        //     console.log(error);
        // }
    }
}

export default reviewServices;