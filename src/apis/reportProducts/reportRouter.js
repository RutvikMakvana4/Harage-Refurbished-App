import express from "express";
import asyncWrap from "express-async-wrapper";
import reportController from "./reportController";
import authentication from "../../common/middleware/authentication";
import storeFiles from "../../common/middleware/multerImageStore";

import validator from "../../common/config/joiValidation";
import reportDto from "./dtos/reportDto";

const routes = express.Router();

routes.post('/', authentication, storeFiles('public/reportImage', 'image', 'array'), validator.body(reportDto), asyncWrap(reportController.reportProduct));

routes.get('/report-return-list', authentication, asyncWrap(reportController.reportReturnExchangeList));

module.exports = routes;

