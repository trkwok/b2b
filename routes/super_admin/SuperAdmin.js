import express from 'express';
//import {agentController} from "../controller/agentController";
import {
    isRequestValidated,
    validateAdmin,
    agentStatusUpdate
} from '../../utils/validator';
import {upload} from "../../utils/fileUploader";
import {imageHandler} from "../../helpers/imageHandler";
import {adminController} from '../../admin/controller/adminController';
import {staffController} from '../../agent/controller/staffController';
import {agentController} from '../../agent/controller/agentController';
import {depositController} from '../../agent/controller/depositController';
import {updateStatusValidationRules }from '../../utils/depositeValidator';

const router = express.Router();


router.route('/create_admin')
    .post(upload.single('image'),
        validateAdmin, isRequestValidated, imageHandler, adminController.createAdmin)

/*router.route('/login')
    .post(validateSigninRequest, isRequestValidated, adminController.loginAdmin)*/
router.route('/admin_get_all_staff').get(staffController.getStaff)
router.route('/get_all_agent').get(agentController.getAgent)
router.route('/change_agent_status/:id')
    .post(agentStatusUpdate,isRequestValidated,adminController.changeAgentStatus)

router.route('/get_all_deposit').get(depositController.getAllDepositRequestsController)

router.route('/change_deposit_status/:id')
    .put(updateStatusValidationRules,isRequestValidated,depositController.changeStatusDeposit)

/*router.route('/update_agent')
    .put(upload.single('image'),
        updateAgentRequest, isRequestValidated, imageHandler,removeStoreImage, agentController.updateAgent)



router.route('/agent_cms').post(validateCmsItem, isRequestValidated,agentController.cmsAgent)

router.route('/agent_certificates')
    .post(upload.array('images',4), agentController.updateCertificates)
    //.delete(removeCertificate)

router.route('/agent_forgot_password')
    .post(validateFormData,isRequestValidated,agentController.forgotPassword)

router.route('/agent_reset_password')
         .post(validateResetPasswordData,isRequestValidated,agentController.resetPassword)

router.route('/agent_change_password')
    .post(validateChangePasswordData, isRequestValidated, agentController.changePassword)*/

export default router;
