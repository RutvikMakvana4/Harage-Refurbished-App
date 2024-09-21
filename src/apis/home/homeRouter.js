import express from "express";
import asyncWrap from "express-async-wrapper";
import homeController from "./homeController";

const routes = express.Router();
import authentication from "../../common/middleware/authentication";
import guestUserAuthentication from "../../common/middleware/guestUserAuthentication";

routes.get(
  "/home",
  guestUserAuthentication,
  asyncWrap(homeController.homePage)
);
routes.get(
  "/search",
  guestUserAuthentication,
  asyncWrap(homeController.search)
);
routes.get(
  "/price-listing",
  guestUserAuthentication,
  asyncWrap(homeController.priceListing)
);

module.exports = routes;
