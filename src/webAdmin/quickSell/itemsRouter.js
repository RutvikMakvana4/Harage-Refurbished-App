import express from "express";
import asyncWrap from "express-async-wrapper";
import itemController from "./itemsController";

const routes = express.Router();

routes.get("/", asyncWrap(itemController.quickSellPage));

routes.get("/sell-items", asyncWrap(itemController.quickSellList));

routes.get("/view-item/:id", asyncWrap(itemController.viewProductDetail));
routes.post("/update-status/:id", asyncWrap(itemController.updateStatus));
routes.post(
  "/update-item-status/:id",
  asyncWrap(itemController.updateItemStatus)
);
routes.post("/price-request", asyncWrap(itemController.sendPriceRequest));
routes.post(
  "/send-rejection-reason",
  asyncWrap(itemController.sendRejectionReason)
);

routes.post(
  "/send-confirmation",
  asyncWrap(itemController.sendForConfirmation)
);

module.exports = routes;
