import httpStatus from "http-status";
import catchAsyncErrors from '../../errorHandler/catchAsyncErrors';
import { depositService } from '../service/depositeService';


const createDepositRequestController = catchAsyncErrors(
    async (req, res, next) => {
        const result = await depositService.createDeposit(req, res, next);
        result &&   res.status(httpStatus.OK).send({
            success: true,
            message: "Deposit request created successfully",
            data: result,
        });
    }
);


const getAllDepositRequestsController = catchAsyncErrors(
    async (req, res, next) => {

        const result = await depositService.getAllDepositRequests(req, res, next);
        result &&   res.status(httpStatus.OK).send({
            success: true,
            message: "Deposit requests fetched successfully",
            data: result,
        });
    }
)

const  changeStatusDeposit = catchAsyncErrors(
    async (req, res, next) => {
        const result = await depositService.changeStatusDeposit(req, res, next);
        result &&   res.status(httpStatus.OK).send({
            success: true,
            message: "Deposit status changed successfully",
            data: result,
        });
    }
)
export const depositController ={

    createDepositRequestController,
    getAllDepositRequestsController,
    changeStatusDeposit
}
