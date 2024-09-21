import express from "express";
import asyncWrap from "express-async-wrapper";
import authController from "./authController";

const routes = express.Router();

routes.post('/super-admin-login', asyncWrap(authController.login));

module.exports = routes;