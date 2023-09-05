import catchAsyncErrors from '../../errorHandler/catchAsyncErrors';
import {adminService as agentService} from '../services/adminService';
import {adminAuth} from '../authentatcion/adminAuth';


const createAdmin = catchAsyncErrors(async (req, res, next) => {

    const result = await agentService.createAdmin(req, res, next);
    result && res.status(200).send({
        success: true,
        message: 'Admin created successfully',
        data: result
    })
});

const loginAdmin = catchAsyncErrors(async (req, res, next) => {
    const result = await adminAuth.loginAdmin(req, res, next, 'admin');
    result && res.status(200).send({
        success: true,
        message: 'Admin login successfully',
        data: result
    })
})

export const adminController = {

    createAdmin,
    loginAdmin
}