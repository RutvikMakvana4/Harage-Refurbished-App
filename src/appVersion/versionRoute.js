import express from "express";
import asyncWrap from "express-async-wrapper";
import AppVersionController from "./versionController";

const routes = express.Router();

routes.post('/', asyncWrap(AppVersionController.checkUpdate));

module.exports = routes;