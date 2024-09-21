import express from "express";
import asyncWrap from "express-async-wrapper";
import categoryController from "./categoryController";
const routes = express.Router();

routes.get('/category-listing', asyncWrap(categoryController.allCategories));
routes.get('/sub-category/:id', asyncWrap(categoryController.subCategories));
routes.get('/sub-subcategory/:id', asyncWrap(categoryController.subSubCategories));

routes.get('/sub-category-list/:id', asyncWrap(categoryController.subCategoryList));

module.exports = routes;

