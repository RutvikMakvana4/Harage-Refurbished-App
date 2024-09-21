import express from "express";
import asyncWrap from "express-async-wrapper";
import returnExchangeController from "./returnExchangeController";
import authentication from "../../common/middleware/authentication";
import storeFiles from "../../common/middleware/multerImageStore";

const routes = express.Router();

routes.post('/', authentication, storeFiles('public/returnexchange', 'image', 'array'), asyncWrap(returnExchangeController.returnOrExchangeProduct));

module.exports = routes;

