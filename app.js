import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config'
import errorHandler from "./errorHandler/error";
import ErrorResponse from "./errorHandler/errorResponse";
import httpStatus from "http-status";
//const indexRouter = require('./routes/index');
import agentRouter  from './routes/agent/agentIndex';
import staffRouter from './routes/staff/staffIndex';
import SuperAdminRouter  from './routes/super_admin/SuperAdminIndex';
import env from './utils/validateENV'
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/public/uploads", express.static(__dirname + "/public/uploads"));


/*app.use('/', indexRouter);*/


app.use('/api/v1/agent', agentRouter);

app.use('/api/v1/staff', staffRouter);
app.use('/api/v1/super_admin', SuperAdminRouter);

app.use((req, res, next) => {
    next(new ErrorResponse( `path: ${req.originalUrl} not found`,  404))
})

app.use(errorHandler)

app.listen(env.PORT, (err, req, res) => {
    console.log('listening on port')
})
module.exports = app;
