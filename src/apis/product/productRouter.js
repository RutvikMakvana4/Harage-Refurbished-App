import express from "express";
import asyncWrap from 'express-async-wrapper'
import productController from "./productController";

const routes = express.Router();
import authentication from "../../common/middleware/authentication";
import guestUserAuthentication from "../../common/middleware/guestUserAuthentication";
import validator from "../../common/config/joiValidation";
import { productDto } from "./dtos/productDto";
import storeFiles from "../../common/middleware/multerImageStore";

routes.post('/add-products', authentication, storeFiles('public/productImages', 'image', 'array'), asyncWrap(productController.addProducts));

routes.get('/product-listing', guestUserAuthentication, asyncWrap(productController.allProducts));
routes.get('/findProducts', asyncWrap(productController.findProducts));

routes.get('/product-listing/:id', guestUserAuthentication, asyncWrap(productController.productDetails));

routes.get('/available-product-details', guestUserAuthentication, asyncWrap(productController.availableDetails));
routes.post('/apply-filter', guestUserAuthentication, asyncWrap(productController.applyFilter));

routes.delete('/delete-product-image/:id', authentication, asyncWrap(productController.deleteProductImage));
routes.delete('/delete-product/:id', asyncWrap(productController.deleteProduct));

module.exports = routes;