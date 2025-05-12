const express = require("express");
const cors = require("cors");
const { SUCCESS_STATUS, ERROR_STATUS } = require("./utils/status");
const {
  HOME_ROUTE_RESPONSE,
  ROUTE_NOT_FOUND_MESSAGE,
} = require("./utils/response");
const app = express();
const corsUrl = process.env.CORS_URL;
const errorHandler = require("./middleware/error.handler");
const UserRouter = require("./route/user.route");
const BusinessRouter = require("./route/business.route");
const PaymentRouter = require("./route/payment.route");

// app middlewares
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (corsUrl) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// all routes
app.use("/api/auth", UserRouter);
app.use("/api/business", BusinessRouter);
app.use("/api/payment", PaymentRouter);

// main route
app.get("/", (req, res) => {
  res.status(200).json({
    status: SUCCESS_STATUS,
    message: HOME_ROUTE_RESPONSE,
  });
});

// error middleware
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({
    status: ERROR_STATUS,
    message: ROUTE_NOT_FOUND_MESSAGE,
  });
});

module.exports = app;
