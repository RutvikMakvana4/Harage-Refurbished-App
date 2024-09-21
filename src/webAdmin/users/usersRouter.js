import express from "express";
import asyncWrap from "express-async-wrapper";
import usersController from "./usersController";
import authentication from "../middleware/authentication";
import storeFiles from "../../common/middleware/multerImageStore";

const routes = express.Router();

routes.get('/:id', asyncWrap(usersController.usersPage));
routes.get('/viewUser/:id', asyncWrap(usersController.viewUsers));

routes.delete('/delete-user/:id', asyncWrap(usersController.deleteUsers));

routes.get('/updateUserPage/:id', asyncWrap(usersController.updateUserPage));
routes.post('/updateUserPage/:id', storeFiles('public/usersProfile', 'image', 'single'), asyncWrap(usersController.updateUser));

routes.put('/approve-user/:id', asyncWrap(usersController.appovedUser));

module.exports = routes;