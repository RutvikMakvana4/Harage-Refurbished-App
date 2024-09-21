import Joi from "joi";

export const addressDto = Joi.object().keys({
    type: Joi.required(),
    buildingName: Joi.optional(),
    company: Joi.optional(),
    floor: Joi.optional(),
    houseNumber: Joi.optional(),
    apartmentNo: Joi.optional(),
    street: Joi.string().required(),
    additionalDirection: Joi.optional(),
    countryCode: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    landlineNumber: Joi.optional(),
    isDefault: Joi.boolean(),
    latitude: Joi.optional(),
    longitude: Joi.optional()
});