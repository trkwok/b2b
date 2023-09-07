import express from 'express';
import {adminController} from '../../admin/controller/adminController';

import {agentStatusUpdate, isRequestValidated, validateSigninRequest} from '../../utils/validator';
import {staffController} from '../../agent/controller/staffController';
import {agentController} from '../../agent/controller/agentController';

const router = express.Router();

router.route('/login').post(validateSigninRequest,
    isRequestValidated, adminController.loginAdmin)

router.route('/change_agent_status/:id')
    .post(agentStatusUpdate,isRequestValidated,adminController.changeAgentStatus)

router.get('/admin_get_all_agent', staffController.getStaff)
router.get('/admin_get_all_agent', agentController.getAgent)
export default router;