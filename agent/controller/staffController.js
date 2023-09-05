import catchAsyncErrors from "../../errorHandler/catchAsyncErrors";
import { staffService } from "../service/staffService";
import {authService} from "../authentation/authServices";

const createStaff = catchAsyncErrors(async (req, res, next) => {
  const result = await staffService.createStaffMember(req, res, next);
  res.status(200).send({
    success: true,
    message: "Staff successfully created",
    data: result,
  });
});
const getStaff = catchAsyncErrors(async (req, res, next) => {
  const staffMembers = await staffService.getStaffMembers(req, res, next);
  res.status(200).json({
    success: true,
    message: "Successfully retrieved staff members",
    data: staffMembers,
  });
});

const loginStaff = catchAsyncErrors(async (req,res,next) => {

  const result = await authService.loginAgent(req,res,next, 'staff');
  result && res.status(200).send({
    success:true,
    message:"Login Successfully ",
    data:result
  })
})

const updateStaff = catchAsyncErrors(async (req, res, next) => {
  const result = await staffService.staffUpdate(req, res, next);
  res.status(200).send({
    success: true,
    message: "Staff Account Successfully Updated",
    data: result
  });

});
export const staffController = {
  createStaff,
  getStaff,
  loginStaff,
  updateStaff
};
