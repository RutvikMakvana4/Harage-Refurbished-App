import express from "express";
import asyncWrap from "express-async-wrapper";
import categoryController from "./categoryController";
import authentication from "../../common/middleware/authentication";
import guestUserAuthentication from "../../common/middleware/guestUserAuthentication";

const routes = express.Router();

routes.get(
  "/category-listing",
  guestUserAuthentication,
  asyncWrap(categoryController.allCategories)
);
routes.get('/sub-category/:id', authentication, asyncWrap(categoryController.subCategories));
routes.get('/sub-subcategory/:id', authentication, asyncWrap(categoryController.subSubCategories));

routes.get(
  "/sub-category-list/:id",
  guestUserAuthentication,
  asyncWrap(categoryController.subCategoryList)
);

module.exports = routes;

