import express from "express";
import asyncWrap from "express-async-wrapper";
import historyController from "./historyController";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get('/sell-items', authentication, asyncWrap(historyController.orderHistory));

routes.get('/sell-item-details/:id', authentication, asyncWrap(historyController.orderHistoryDetails));

routes.get('/item-detail-action/:id', authentication, asyncWrap(historyController.itemDetailAction));

routes.delete('/sell-item-delete/:id', authentication, asyncWrap(historyController.sellingItemDelete));

routes.post('/invoice/:id', authentication, asyncWrap(historyController.invoiceDownload));

module.exports = routes;