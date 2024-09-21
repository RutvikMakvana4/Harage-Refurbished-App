import express from "express";
import asyncWrap from "express-async-wrapper";
import supportController from "./supportController";

import validator from "../../common/config/joiValidation";
import supportDto from "./dtos/supportDto";

const routes = express.Router();

routes.post('/', validator.body(supportDto), asyncWrap(supportController.contactSupport));

module.exports = routes;