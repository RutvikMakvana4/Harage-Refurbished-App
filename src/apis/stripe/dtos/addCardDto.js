import Joi from "joi";

export default Joi.object().keys({
    fullName: Joi.string().trim().required(),
    cardNumber: Joi.number().required(),
    cvc: Joi.number().required(),
    expMonth: Joi.number().required(),
    expYear: Joi.number().required(),
    isDefault: Joi.boolean().required(),
});