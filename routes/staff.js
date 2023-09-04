import express from 'express';
import {staffController} from "../controller/staffController";
import  {validateStaffCreation,isRequestValidated} from "../utils/validator";
const router = express.Router();

router.route('/create_staff').post(validateStaffCreation,isRequestValidated,staffController.createStaff)
router.get('/', staffController.getStaff)
export default router;
