import express from "express";
import asyncWrap from 'express-async-wrapper'
import cartController from "./cartController";

const routes = express.Router();
import authentication from "../../common/middleware/authentication";

routes.post('/add-to-cart/:id', authentication, asyncWrap(cartController.addToCart));

routes.get('/cart-products', authentication, asyncWrap(cartController.getCartProducts));

routes.delete('/cart-products/:id', authentication, asyncWrap(cartController.removeProduct));

routes.post('/buy-now/:id', authentication, asyncWrap(cartController.buyNow))

routes.get('/payment-success', asyncWrap(cartController.skipcashPaymentSuccess))

routes.get('/checkout', authentication, asyncWrap(cartController.checkout))

routes.post('/checkout/pay-now/:id', authentication, asyncWrap(cartController.payNow))

routes.get('/order-details/:id', authentication, asyncWrap(cartController.purchaseOrderDeteils));

routes.get('/order-products/:id', authentication, asyncWrap(cartController.orderProducts));

routes.post('/track-order', authentication, asyncWrap(cartController.trackOrder));

routes.post('/cancel-order/:id', authentication, asyncWrap(cartController.cancelOrder));

routes.post('/refund/:id', asyncWrap(cartController.skipcashRefundAmount));

module.exports = routes;