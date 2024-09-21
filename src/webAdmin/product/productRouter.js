import express from "express";
import asyncWrap from "express-async-wrapper";
import productController from "./productController";

import storeFiles from "../../common/middleware/multerImageStore";

const routes = express.Router();

routes.get('/add-product', asyncWrap(productController.addProductPage));
routes.post('/add-product', storeFiles('public/productImages', 'image', "array"), asyncWrap(productController.addProduct));

routes.get('/product-page/:id', asyncWrap(productController.productListPage));
routes.get('/product-list/:id', asyncWrap(productController.productList));

routes.get('/draft-product-page', asyncWrap(productController.draftProductListPage));
routes.get('/draft-product-list', asyncWrap(productController.draftProductList));


// routes.get('/view-product-page', asyncWrap(productController.viewProductDetailPage));
routes.get('/view-product/:id', asyncWrap(productController.viewProductDetail));

routes.delete('/delete-product/:id', asyncWrap(productController.deleteProducts));
routes.delete('/delete-image/:id', asyncWrap(productController.deleteImage));

routes.get('/updateProductPage/:id', asyncWrap(productController.updateProductPage));
routes.post('/updateProductPage/:id', storeFiles('public/productImages', 'image', 'array'), asyncWrap(productController.updateProduct));

module.exports = routes;