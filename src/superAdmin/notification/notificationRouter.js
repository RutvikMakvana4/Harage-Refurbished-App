import express from "express";
import asyncWrap from "express-async-wrapper";
import notificationController from "./notificationController";

const routes = express.Router();

routes
    .get("/history", asyncWrap(notificationController.notificationHistory))
    .post("/readAt", asyncWrap(notificationController.notificationReadAt))

    .get('/un-read', asyncWrap(notificationController.unReadNotificationCount))

module.exports = routes;