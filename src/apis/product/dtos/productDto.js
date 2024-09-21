import Joi from "joi";

export const productDto = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    condition: Joi.string().required(),
    storage: Joi.string().required(),
    color: Joi.string().required(),
    model: Joi.string().required(),
    quantity: Joi.string().required(),
    yearOfManufacture: Joi.number().required(),
    price: Joi.string().required(),
    additionalDetails: Joi.string().required(),
    rating: Joi.string().required(),
});
