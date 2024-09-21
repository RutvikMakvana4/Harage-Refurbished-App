import Joi from "joi";

export const loginDto = Joi.object().keys({
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(8).trim().required(),
});