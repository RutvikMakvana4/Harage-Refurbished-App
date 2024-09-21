import express from "express";
import { logo } from "../src/common/helper";

const routes = express.Router();

routes.use('/api/v1', require('./apis/index'));

routes.use('/super-admin', require('./superAdmin/index'));

routes.use('/webAdmin', require('./webAdmin/index'));

routes.get('/changelogs', (req, res) => {
    return res.render('apis/changelogs', { layout: 'apis/changelogs' });
});

routes.get('/payment-verification', (req, res) => {
    return res.render('payment/success', { layout: 'payment/success', logo: logo() });
})

module.exports = routes;