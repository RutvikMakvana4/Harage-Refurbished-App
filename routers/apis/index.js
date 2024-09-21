import express from "express";
import authentication from "../../src/common/middleware/authentication";
const routes = express.Router();

routes.use((req, res, next) => {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    console.log(
      `Request to ${req.method} ${req.originalUrl} took ${elapsedTimeInMs} ms`
    );
  });

  next();
});

routes.use('/auth', require('../../src/apis/auth/authRouter'));
routes.use('/users', authentication, require('../../src/apis/users/usersRouter'));
routes.use('/home-page', require('../../src/apis/home/homeRouter'));


routes.use('/category', require('../../src/apis/category/categoryRouter'));
routes.use('/fcm', require('../../src/apis/fcmToken/fcmRouter'));

// products
routes.use('/product', require('../../src/apis/product/productRouter'));

// items
routes.use('/items', authentication, require('../../src/apis/quickSell/itemsRouter'));

// order-history
routes.use('/order-history', require('../../src/apis/orderHistory/historyRouter'));

// cart
routes.use('/cart', require('../../src/apis/cart/cartRouter'));

routes.use('/order', authentication, require('../../src/apis/review/reviewRouter'));

routes.use('/report', authentication, require('../../src/apis/reportProducts/reportRouter'));

routes.use('/return-exchange', authentication, require('../../src/apis/returnAndExchange/returnExchangeRouter'));

// address
routes.use('/address', authentication, require('../../src/apis/address/addressRouter'));

// Stripe payment
routes.use('/stripe', authentication, require('../../src/apis/stripe/stripeRouter'));

routes.use('/contact-support', authentication, require('../../src/apis/contactSupport/supportRouter'));

// App version check
routes.use("/customer-check-version", require('../../src/appVersion/versionRoute'));

// Notification history
routes.use("/notification", authentication, require('../../src/apis/notification/notificationRouter'))

module.exports = routes;