import express from "express";
import asyncWrap from "express-async-wrapper";
import reviewController from "./reviewController";
import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.post('/review/:id', authentication, asyncWrap(reviewController.orderReview));

module.exports = routes;

