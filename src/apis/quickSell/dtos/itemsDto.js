import Joi from "joi";

export const itemDto = Joi.object().keys({
    subCategoryId : Joi.optional(),
    subSubCategoryId : Joi.optional(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    condition: Joi.string().required(),
    color: Joi.string().required(),
    model: Joi.string().required(),
    warrantyExpireDate: Joi.string().required(),
    quantity: Joi.string().required(),
    yearOfManufacture: Joi.number().required(),
    price: Joi.string().required(),
    additionalDetails: Joi.string().required(),
});