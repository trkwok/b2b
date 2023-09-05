import express from 'express';

import authJWT from '../../admin/helpers/authJwt';
import superAdmin from './SuperAdmin'
const router = express.Router();

router.use(authJWT())
router.use('/', superAdmin)

export default router;
