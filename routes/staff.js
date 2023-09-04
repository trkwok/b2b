import express from 'express';
import {staffController} from "../controller/staffController";
import {validateStaffCreation, isRequestValidated, staffUpdateValidators} from "../utils/validator";
const router = express.Router();

router.route('/create_staff').post(validateStaffCreation,isRequestValidated,staffController.createStaff)
router.route('/update_staff/:id').put(staffUpdateValidators,isRequestValidated,staffController.updateStaff)
router.get('/', staffController.getStaff)
export default router;
