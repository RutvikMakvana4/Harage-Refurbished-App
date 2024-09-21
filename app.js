import "dotenv/config";
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import fs from "fs";
import mainRouter from "./routers/index";
import swaggerSetup from "./src/common/swagger";
import MongoStore from "connect-mongo";
import { JWT } from "./src/common/constants/constants";
import "./src/common/config/jwtPassport";
import "./src/common/config/dbConnection";
import "./crons/index";
import "./seeders/categorySeeder";
import "./seeders/adminSeeder";
import "./seeders/superAdminSeeder";
import "./seeders/paymentMethodSeeder";
import "./seeders/orderStatusSeeder";
import "./seeders/reportAndReturnExchangeSeeder";
import "./seeders/appVersionSeeder";

const app = express();

const PORT = process.env.PORT || 8004;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false, limit: "52428800" }));
app.use(express.json({ limit: "52428800" }));

if (process.env.ENV === "development") {
  app.use(
    session({
      name: "Harage-Refurbished-Ecommerce-App",
      secret: JWT.SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECTION,
      }),
    })
  );
} else {
  app.use(
    session({
      secret: JWT.SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
}

// Flash message globelly define
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(swaggerSetup);
app.use(mainRouter);

app.use(express.static(path.join(__dirname + "/public")));
app.use(require("./src/common/middleware/error"));

app.get("/email", (req, res) => {
  return res.render("otpVerification/otp-verification");
});

const isSecure = process.env.IS_SECURE === "true";
const port = isSecure ? process.env.PORT : process.env.PORT;

if (isSecure) {
  var options = {
    key: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/privkey.pem`),
    cert: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
    ca: [
      fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
      fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/fullchain.pem`),
    ],
  };
  var https = require("https").Server(options, app);

  https.listen(port, () => {
    console.log(
      `Https server is running on https://${process.env.HOST}:${PORT}`
    );
  });
} else {
  app.listen(PORT, (err) => {
    if (err) throw new console.log("Server not connect");
    console.log(`Server is running on http://${process.env.HOST}:${PORT}`);
  });
}

// app.listen(PORT, (err) => {
//   if (err) throw new console.log("Server not connect");
//   console.log(`Server is running on http://${process.env.HOST}:${PORT}`);
// });
