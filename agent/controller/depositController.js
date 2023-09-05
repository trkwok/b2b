import httpStatus from "http-status";
import catchAsyncErrors from '../../errorHandler/catchAsyncErrors';
import { depositService } from '../service/depositeService';

const createBankTransfer = catchAsyncErrors(async (req, res, next) => {
    const result = await depositService.createBankTransfer(req, res, next);
    res.status(httpStatus.OK).send({
        success: true,
        message: "Bank transfer created successfully",
        data: result,
    });
});
const createChequeTransfer = catchAsyncErrors(async (req, res, next) => {
    const result = await depositService.createChequeTransfer(req, res, next);
    res.status(httpStatus.OK).send({
        success: true,
        message: "Cheque transfer created successfully",
        data: result,
    });
});

const createCashDeposit = catchAsyncErrors(async (req, res, next) => {
    const result = await depositService.createCashDeposit(req, res, next);
    res.status(httpStatus.OK).send({
        success: true,
        message: "Cash deposit created successfully",
        data: result,
    });
});
export const depositController ={
    createBankTransfer,
    createChequeTransfer,
    createCashDeposit
}
