import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "dotenv/config";
import errorHandler from "./errorHandler/error";
import ErrorResponse from "./errorHandler/errorResponse";
import env from './utils/validateENV'
//const indexRouter = require('./routes/index');
import agentRouter from "./routes/agent";
import authJwt from "./helpers/authJWT";
import staffRoute from "./routes/staff";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authJwt());

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

/*app.use('/', indexRouter);*/

app.use("/api/v1/agent", agentRouter);
app.use("/api/v1/staff", staffRoute);

app.use((req, res, next) => {
  next(new ErrorResponse(`path: ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

app.listen(env.PORT, (err, req, res) => {
  console.log(`listening on port ${env.PORT}`);
});
module.exports = app;