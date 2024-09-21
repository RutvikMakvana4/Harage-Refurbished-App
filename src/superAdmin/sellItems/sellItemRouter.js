import express from "express";
import asyncWrap from "express-async-wrapper";
import sellItemsController from "./sellItemController";

import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes
    .get('/sell-items', authentication, asyncWrap(sellItemsController.sellingHistory))
    .get('/see-details', authentication, asyncWrap(sellItemsController.orderFullDetails))

    .post('/assign-member', authentication, asyncWrap(sellItemsController.assignMember))

    .post('/update-order-status', authentication, asyncWrap(sellItemsController.updateOrderStatus))
    .post('/update-item-status', authentication, asyncWrap(sellItemsController.updateOrderItemsStatus))
    .post('/price-request', authentication, asyncWrap(sellItemsController.sendPriceRequest))
    .post('/send-rejection-reason', authentication, asyncWrap(sellItemsController.sendRejectionReason))
    .get('/item-details', authentication, asyncWrap(sellItemsController.itemDetails));

module.exports = routes;