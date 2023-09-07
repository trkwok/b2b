import express from 'express';
import {agentController} from "../../agent/controller/agentController";
import {
    validateSignupRequest,
    isRequestValidated,
    updateAgentRequest,
    validateSigninRequest,
    validateCmsItem,
    validateFormData,
    validateResetPasswordData,
    validateChangePasswordData,
    validateStaffCreation,
    validateRequestBody
} from '../../utils/validator';
import {upload} from "../../utils/fileUploader";
import {imageHandler, MultipleImageHandler, removeCertificatesImages, removeStoreImage}
    from "../../helpers/imageHandler";
import {staffController} from "../../agent/controller/staffController";
import authJwt from "../../helpers/authJWT";

const router = express.Router();

router.use(authJwt())
router.route('/create_agent')
    .post(upload.single('image'),
        validateSignupRequest, isRequestValidated,
        imageHandler, agentController.createAgent)

router.route('/update_agent')
    .put(upload.single('image'),
        updateAgentRequest, isRequestValidated,imageHandler, removeStoreImage,
        agentController.updateAgent)

router.route('/agent_login')
    .post(validateSigninRequest, isRequestValidated,
        agentController.loginAgent)

router.route('/agent_cms').post(validateCmsItem, isRequestValidated,
    agentController.cmsAgent)

router.route('/agent_certificates')
    .post(upload.array('images', 4),MultipleImageHandler,
        removeCertificatesImages,validateRequestBody,isRequestValidated, agentController.updateCertificates)


router.route('/agent_forgot_password')
    .post(validateFormData, isRequestValidated, agentController.forgotPassword)

router.route('/agent_reset_password')
    .post(validateResetPasswordData, isRequestValidated, agentController.resetPassword)

router.route('/agent_change_password')
    .post(validateChangePasswordData, isRequestValidated, agentController.changePassword)


router.route('/create_staff')
    .post(validateStaffCreation,isRequestValidated,staffController.createStaff)


//router.get('/get_staff', staffController.getStaff)

export default router;
