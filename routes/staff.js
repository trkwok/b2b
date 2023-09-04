import express from "express";
import  {validateStaffCreation,isRequestValidated} from "../utils/validator";
import {staffController} from "../controller/staffController";
const router = express.Router();

router
  .route("/create_staff")
  .post(validateStaffCreation, isRequestValidated, staffController.createStaff);
router.get("/", staffController.getStaff);

export default router;
