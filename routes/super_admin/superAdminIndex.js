import express from 'express';

import {superAdminJwt} from '../../admin/helpers/authJwt';
import superAdmin from './SuperAdmin'
const router = express.Router();

router.use(superAdminJwt)
router.use('/', superAdmin)

export default router;
