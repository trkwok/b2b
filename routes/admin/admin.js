import express from 'express';
import {adminController} from '../../admin/controller/adminController';

import {agentStatusUpdate, isRequestValidated, validateSigninRequest} from '../../utils/validator';
import {staffController} from '../../agent/controller/staffController';
import {agentController} from '../../agent/controller/agentController';
import {depositController} from '../../agent/controller/depositController';
import {updateStatusValidationRules} from '../../utils/depositeValidator';
import {upload} from '../../utils/fileUploader';
import {imageHandler} from '../../helpers/imageHandler';

const router = express.Router();

router.route('/login').post(validateSigninRequest,
    isRequestValidated, adminController.loginAdmin)

router.route('/change_agent_status/:id')
    .post(agentStatusUpdate,isRequestValidated,adminController.changeAgentStatus)

router.route('/admin_get_all_staff').get(staffController.getStaff)
router.route('/admin_get_all_agent').get(agentController.getAgent)
router.route('/get_all_deposit').get(depositController.getAllDepositRequestsController)
router.route('/change_deposit_status/:id')
    .put(upload.single('/admin_attachment'),updateStatusValidationRules,isRequestValidated,
        imageHandler,depositController.changeStatusDeposit)
export default router;