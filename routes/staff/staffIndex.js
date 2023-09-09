import express from 'express';
import depositRouter from '../deposite/deposit'

import staffJwt from "../../helpers/staffJwt";
import staffRouter from './staff'
const router = express.Router();


router.use(staffJwt())
router.use('/',staffRouter)
router.use('/deposit', depositRouter)


//router.get('/get_staff', staffController.getStaff)

export default router;
