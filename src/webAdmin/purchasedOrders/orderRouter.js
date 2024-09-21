import express from "express";
import asyncWrap from 'express-async-wrapper';
import orderController from "./orderController";

const routes = express.Router();

routes.get('/', asyncWrap(orderController.purchasedOrderPage));

routes.get('/purchased-orders', asyncWrap(orderController.purchasedOrderList));

routes.get('/view-product/:id', asyncWrap(orderController.viewProductDetail));

routes.post('/update-status/:id', asyncWrap(orderController.updateStatus));

module.exports = routes;