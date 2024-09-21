import express from "express";
import asyncWrap from 'express-async-wrapper';
import itemController from "./itemsController";

const routes = express.Router();
import authentication from "../../common/middleware/authentication";
import validator from "../../common/config/joiValidation";
import { itemDto } from "./dtos/itemsDto"
import storeFiles from "../../common/middleware/multerImageStore";

routes.post('/add-items', authentication, storeFiles('public/itemImages', 'image', 'array'), asyncWrap(itemController.addItems));
routes.get('/items-listing', authentication, asyncWrap(itemController.addItemList));
routes.get('/item-details/:id', asyncWrap(itemController.getItemDetails));
routes.put('/edit-item/:id', authentication, storeFiles('public/itemImages', 'image', 'array'), asyncWrap(itemController.editItem));
routes.delete('/delete-image/:ids', authentication, asyncWrap(itemController.deleteItemImage));
routes.delete('/delete-item/:id', asyncWrap(itemController.deleteItem));

routes.post('/send-now/:id', authentication, asyncWrap(itemController.sendNow));

routes.post("/price-request", authentication, asyncWrap(itemController.acceptRejectPrice));

module.exports = routes;