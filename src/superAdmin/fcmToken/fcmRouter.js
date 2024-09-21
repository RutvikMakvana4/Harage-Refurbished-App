import express from "express";
import asyncWrap from "express-async-wrapper";
import fcmController from "./fcmController";
import fcmDtos from "./dtos/fcmDtos";
import validator from "../../common/config/joiValidation";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.post('/super-admin-token', authentication, validator.body(fcmDtos), asyncWrap(fcmController.fcmRegister));

module.exports = routes;