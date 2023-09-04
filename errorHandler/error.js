import ErrorResponse  from './errorResponse';
import httpStatus from "http-status";

const errorHandler = (err, req, res, next) =>{

   //console.log(err);
 //  console.log(req.files)
    //console.log('here')
    let error = {...err}
    error.message = err.message;
    console.log(error.message);

    // Mongoose Bad ObjectId
    if (err.name === 'CastError'){
        const message = "Resource not found";
        error = new ErrorResponse(message,  httpStatus.INVALID);
    }

    if (err.code === 11000){
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message,  httpStatus.INVALID);
    }

    if  (err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(message,  httpStatus.INVALID);

    }
    if (err.name === "JsonWebTokenError") {
        const message = "Json Web Token is invalid, Try again";
        error = new ErrorResponse(message,
        httpStatus.INVALID);
    }

    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is Expired, Try again";
        error = new ErrorResponse(message,  httpStatus.INVALID);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })

    next()
}

export default errorHandler;