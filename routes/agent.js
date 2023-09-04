import express from 'express';
import {agentController} from "../controller/agentController";
import {
    validateSignupRequest,
    isRequestValidated,
    updateAgentRequest,
    validateSigninRequest,
    validateCmsItem, validateFormData, validateResetPasswordData, validateChangePasswordData
} from "../utils/validator";
import {upload} from "../utils/fileUploader";
import {imageHandler, removeStoreImage} from "../helpers/imageHandler";

const router = express.Router();


router.route('/create_agent')
    .post(upload.single('image'),
        validateSignupRequest, isRequestValidated, imageHandler, agentController.createAgent)

router.route('/update_agent')
    .put(upload.single('image'),
        updateAgentRequest, isRequestValidated, imageHandler,removeStoreImage, agentController.updateAgent)

router.route('/agent_login').post(validateSigninRequest, isRequestValidated, agentController.loginAgent)

router.route('/agent_cms').post(validateCmsItem, isRequestValidated,agentController.cmsAgent)

router.route('/agent_certificates')
    .post(upload.array('images',4), agentController.updateCertificates)
    //.delete(removeCertificate)

router.route('/agent_forgot_password')
    .post(validateFormData,isRequestValidated,agentController.forgotPassword)

router.route('/agent_reset_password')
         .post(validateResetPasswordData,isRequestValidated,agentController.resetPassword)

router.route('/agent_change_password')
    .post(validateChangePasswordData, isRequestValidated, agentController.changePassword)

export default router;
