import Joi from "joi";

export const registerDto = Joi.object().keys({
    fullName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    countryCode: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    password: Joi.string().min(8).trim().required(),
    confirmPassword: Joi.string().min(8).trim().required()
});


export const verifyOtpDto = Joi.object().keys({
    countryCode: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    otp: Joi.number().required(),
});


export const resendOtpDto = Joi.object().keys({
    countryCode: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
});


export const otpSendToEmail = Joi.object().keys({
    email: Joi.string().email().trim().required(),
});


export const emailVerifyOtpDto = Joi.object().keys({
    email: Joi.string().email().trim().required(),
    otp: Joi.number().required(),
});

export const sendOtpToPhoneDto = Joi.object().keys({
    email: Joi.string().email().trim().required(),
    countryCode: Joi.string().trim().required(),
    phone: Joi.string().trim().required()
});

export const phoneVerifyOtpDto = Joi.object().keys({
    countryCode: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    otp: Joi.number().required(),
});