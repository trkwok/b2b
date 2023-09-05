import express from 'express';
import {staffController} from "../../agent/controller/staffController";
import {
    validateStaffCreation,
    isRequestValidated,
    validateSigninRequest,
    staffUpdateValidators
} from "../../utils/validator";
import {agentController} from "../../agent/controller/agentController";
import authJwt from "../../helpers/authJWT";
import staffJwt from "../../helpers/staffJwt";
const router = express.Router();


router.use(staffJwt())
router.route('/staff_login')
    .post(validateSigninRequest, isRequestValidated,
       staffController.loginStaff)

router.route('/update_staff/:id')
    .put(staffUpdateValidators,isRequestValidated,staffController.updateStaff)

router.get('/staff_get_all', staffController.getStaff)
export default router;
