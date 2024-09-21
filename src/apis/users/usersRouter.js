import express from "express";
import asyncWrap from "express-async-wrapper";
import usersController from "./usersController";
import authentication from "../../common/middleware/authentication";
import storeFiles from "../../common/middleware/multerImageStore";

const routes = express.Router();

routes.get('/', authentication, asyncWrap(usersController.usersProfileGet));
routes.put('/', authentication, storeFiles('public/usersProfile', 'profileImage'), asyncWrap(usersController.editProfile));

module.exports = routes;

