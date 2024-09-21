import express from "express";
import asyncWrap from "express-async-wrapper";
import logController from "./logController";

const routes = express.Router();

routes.get('/user/', asyncWrap(logController.userLogsPage));
routes.get('/viewUserLogs', asyncWrap(logController.viewUserLogs));

routes.get('/admin/', asyncWrap(logController.adminLogsPage));
routes.get('/viewAdminLogs', asyncWrap(logController.viewAdminLogs));

module.exports = routes;