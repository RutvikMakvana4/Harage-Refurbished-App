import express from "express";
import asyncWrap from "express-async-wrapper";
import addressController from "./addressController";

const routes = express.Router();
import authentication from "../../common/middleware/authentication";
import validator from "../../common/config/joiValidation";
import { addressDto } from "./dtos/addressDto";

routes.post('/add-address', authentication, validator.body(addressDto), asyncWrap(addressController.addAddress));
routes.put('/edit-address/:id', asyncWrap(addressController.editAddress));
routes.delete('/delete-address/:id', asyncWrap(addressController.deleteAddress));
routes.get('/address-list', asyncWrap(addressController.addressList));
routes.post('/setDefault-address/:id', asyncWrap(addressController.setDefaultAddress));
routes.get('/default-address', authentication, asyncWrap(addressController.getDefaultAddress));

module.exports = routes;