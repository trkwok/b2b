import catchAsyncErrors from "../errorHandler/catchAsyncErrors";
import {agentService} from "../service/agentService";
import {authService} from "../authentation/authServices";

const createAgent = catchAsyncErrors(async (req, res,next) => {

    const result = await agentService.createAgent(req,res,next);
     result && res.status(200).send({
        success:true,
        message:"We are verifying Your Account Please Wait ",
        data:result
    })
});

const updateAgent = catchAsyncErrors(async (req,res, next) => {

    const result = await agentService.updateAgent(req,res,next);
    result && res.status(200).send({
        success:true,
        message:"Account Successfully Updated ",
        data:result
    })
})

const loginAgent = catchAsyncErrors(async (req,res,next) => {

    const result = await authService.loginAgent(req,res,next);
    result && res.status(200).send({
        success:true,
        message:"Login Successfully ",
        data:result
    })
})


const cmsAgent = catchAsyncErrors(async (req, res, next) => {

    const result = await agentService.cms(req, res, next)
    result && res.status(200).send({
        success: true,
        message: "cms updated",
        data: result
    })
})

const updateCertificates = catchAsyncErrors(async (req,res,next) => {
    const result = await agentService.updateCertificates(req,res,next);
    result && res.status(200).send({
        success:true,
        message:"Certificate Successfully Updated ",
        data:result
    })
})

const forgotPassword = catchAsyncErrors(async (req,res,next) => {

    const result = await authService.forgotPassword(req,res,next);
    result && res.status(200).send({
        success:true,
        message:"Forgot Password Successfully done ",
        data:result
    })
})

const resetPassword = catchAsyncErrors(async (req, res, next) => {

    const result = await authService.resetPassword(req, res, next)
    result && res.status(200).send({
        success: true,
        message: "Password reset successfully",
        data: result
    })
})

const changePassword = catchAsyncErrors(async (req,res,next) => {

    const result = await authService.changePassword(req,res,next);
    result && res.status(200).send({
        success:true,
        message:"Password Successfully Changed ",
        data:result
    })
})

export const agentController = {
    createAgent,
    updateAgent,
    loginAgent,
    cmsAgent,
    updateCertificates,
    forgotPassword,
    resetPassword,
    changePassword
}