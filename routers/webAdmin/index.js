import express from "express";

const routes = express.Router();
import authentication from "../../src/webAdmin/middleware/authentication";

routes.use("/", require("../../src/webAdmin/auth/authRouter"));
routes.use(
  "/",
  authentication([
    "Administrator",
    "Product Manager",
    "Acquisition Manager",
    "Order Manager",
    "Customer Support Specialist",
  ]),
  require("../../src/webAdmin/dashboard/dashboardRouter")
);

routes.use(
  "/admin",
  authentication([
    "Administrator",
    "Product Manager",
    "Acquisition Manager",
    "Order Manager",
    "Customer Support Specialist",
  ]),
  require("../../src/webAdmin/admins/adminRouter")
);
routes.use(
  "/product",
  authentication(["Administrator", "Product Manager"]),
  require("../../src/webAdmin/product/productRouter")
);
routes.use(
  "/category",
  authentication(["Administrator", "Product Manager"]),
  require("../../src/webAdmin/category/categoryRouter")
);
routes.use(
  "/manageUser",
  authentication(["Administrator"]),
  require("../../src/webAdmin/users/usersRouter")
);

routes.use(
  "/quick-sell",
  authentication(["Administrator", "Acquisition Manager"]),
  require("../../src/webAdmin/quickSell/itemsRouter")
);
routes.use(
  "/order",
  authentication(["Administrator", "Order Manager"]),
  require("../../src/webAdmin/purchasedOrders/orderRouter")
);

routes.use(
  "/managelogs",
  authentication(["Administrator"]),
  require("../../src/webAdmin/logs/logRouter")
);

routes.use(
  "/save-history",
  authentication([
    "Administrator",
    "Product Manager",
    "Acquisition Manager",
    "Order Manager",
    "Customer Support Specialist",
  ]),
  require("../../src/webAdmin/saveHistory/saveRouter")
);
routes.use(
  "/return-exchange",
  authentication(["Administrator", "Customer Support Specialist"]),
  require("../../src/webAdmin/returnAndExchange/returnExchangeRouter")
);

routes.use(
  "/report",
  authentication(["Administrator", "Customer Support Specialist"]),
  require("../../src/webAdmin/report/reportRouter")
);

module.exports = routes;
