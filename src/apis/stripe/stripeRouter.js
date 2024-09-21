import express from "express";
import asyncWrap from "express-async-wrapper";
import stripeController from "./stripeController";

const routes = express.Router();

routes.post("/new-card", asyncWrap(stripeController.createCard));

routes.get('/card-list', asyncWrap(stripeController.cardList));
routes.post('/setDefault-card/:id', asyncWrap(stripeController.setDefaultCard));

routes.post('/edit-card/:id', asyncWrap(stripeController.editCardInfo));
routes.delete('/delete-card/:id', asyncWrap(stripeController.deleteCardInfo));

routes.post('/payment/:id', asyncWrap(stripeController.createCharge));

module.exports = routes;