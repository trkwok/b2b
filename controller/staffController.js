import catchAsyncErrors from "../errorHandler/catchAsyncErrors";
import { staffService } from "../service/staffService";

const createStaff = catchAsyncErrors(async (req, res, next) => {
  const result = await staffService.createStaffMember(req, res, next);
  res.status(200).send({
    success: true,
    message: "Staff successfully created",
    data: result,
  });
});
const getStaff = catchAsyncErrors(async (req, res, next) => {
  const staffMembers = await staffService.getStaffMembers();
  res.status(200).json({
    success: true,
    message: "Successfully retrieved staff members",
    data: staffMembers,
  });
});
const updateStaff = catchAsyncErrors(async (req, res, next) => {
  const result = await staffService.staffUpdate(req, res, next);
  res.status(200).send({
    success: true,
    message: "Staff Account Successfully Updated",
    data: result,
  });
});

export const staffController = {
  createStaff,
  getStaff,
  updateStaff,
};
