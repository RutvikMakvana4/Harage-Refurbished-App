import Joi from "joi";

export default Joi.object().keys({
    token: Joi.string().required(),
    deviceId: Joi.string().required(),
    deviceType: Joi.string().required().valid('iOS', 'Android')
});