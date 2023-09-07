import express from 'express';
//import {agentController} from "../controller/agentController";
import {
    validateSignupRequest,
    isRequestValidated,
    updateAgentRequest,
    validateSigninRequest,
    validateCmsItem,
    validateFormData,
    validateResetPasswordData,
    validateChangePasswordData,
    validateAdmin,
    agentStatusUpdate
} from '../../utils/validator';
import {upload} from "../../utils/fileUploader";
import {imageHandler} from "../../helpers/imageHandler";
import {adminController} from '../../admin/controller/adminController';
import {staffController} from '../../agent/controller/staffController';
import {agentController} from '../../agent/controller/agentController';

const router = express.Router();


router.route('/create_admin')
    .post(upload.single('image'),
        validateAdmin, isRequestValidated, imageHandler, adminController.createAdmin)

/*router.route('/login')
    .post(validateSigninRequest, isRequestValidated, adminController.loginAdmin)*/

router.route('/get_all_agent').get(agentController.getAgent)
router.route('/change_agent_status/:id')
    .post(agentStatusUpdate,isRequestValidated,adminController.changeAgentStatus)

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
