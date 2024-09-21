import express from "express";
import asyncWrap from "express-async-wrapper";
import memberController from "./memberController";

import authentication from "../../common/middleware/authentication";

const routes = express.Router();

routes.get('/member-list', authentication, asyncWrap(memberController.memberList));

module.exports = routes;