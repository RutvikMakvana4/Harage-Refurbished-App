import express from "express";
import asyncWrap from "express-async-wrapper";
import reportController from "./reportController";

const routes = express.Router();

routes.get("/", asyncWrap(reportController.reportListPage));
routes.get("/requests", asyncWrap(reportController.reportList));

module.exports = routes;
