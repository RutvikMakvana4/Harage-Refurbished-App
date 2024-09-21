import express from "express";
import asyncWrap from "express-async-wrapper";
import adminController from "./adminController";
import storeFiles from "../../common/middleware/multerImageStore";

const routes = express.Router();

routes.get('/admin-page', asyncWrap(adminController.adminListPage));
routes.get('/admin-list', asyncWrap(adminController.adminList));

routes.get('/add-admin', asyncWrap(adminController.addAdminPage));
routes.post('/add-admin', storeFiles('public/adminImages', 'image', "single"), asyncWrap(adminController.addAdmin));

routes.delete('/delete-admin/:id', asyncWrap(adminController.deleteAdmin));

routes.get('/updateAdminPage/:id', asyncWrap(adminController.updateAdminPage));
routes.post('/updateAdminPage/:id', storeFiles('public/adminImages', 'image', 'single'), asyncWrap(adminController.updateAdmin));

module.exports = routes;