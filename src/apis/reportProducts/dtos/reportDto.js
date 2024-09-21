import Joi from "joi";

export default Joi.object().keys({
    type: Joi.string().required(),
    orderId: Joi.string().required().when("type", {
        is: '1',
        otherwise: Joi.string().optional(),
    }),
    productId: Joi.string().required().when("type", {
        is: '2',
        otherwise: Joi.string().optional(),
    }),
    reportReason: Joi.string().required(),
    reportDescription: Joi.string().optional()
});
