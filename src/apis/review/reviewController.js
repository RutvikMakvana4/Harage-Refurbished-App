import reviewServices from "./reviewServices";

class reviewController {

    /**
     * @description: order review
     * @param {*} req 
     * @param {*} res 
     */
    static async orderReview(req, res) {
        const data = await reviewServices.orderReview(req.params.id, req.user, req.body, req, res);
        return res.send({ message: "Review submitted successfully", data })
    }

}

export default reviewController;