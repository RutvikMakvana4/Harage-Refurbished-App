import express from "express";
import asyncWrap from "express-async-wrapper";
import saveController from "./saveController";

const routes = express.Router();

routes.post('/save', asyncWrap(saveController.saveKeywords));

routes.get('/search-keywords', asyncWrap(saveController.listOfsaveKeywords));

module.exports = routes;