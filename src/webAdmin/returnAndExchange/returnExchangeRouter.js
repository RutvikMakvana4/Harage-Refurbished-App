import express from "express";
import asyncWrap from "express-async-wrapper";
import returnExchangeController from "./returnExchangeController";

const routes = express.Router();

routes.get('/', asyncWrap(returnExchangeController.returnOrExchangeProductListPage));
routes.get('/requests', asyncWrap(returnExchangeController.returnOrExchangeProductList));

module.exports = routes;

