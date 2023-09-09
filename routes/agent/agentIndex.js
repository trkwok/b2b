import express from 'express';

import authJwt from "../../helpers/authJWT";

import  agentRouter from './agent'
import depositRouter from '../deposite/deposit'

const router = express.Router();

router.use(authJwt())
router.use('/', agentRouter)
router.use('/deposit', depositRouter)


//router.get('/get_staff', staffController.getStaff)

export default router;
