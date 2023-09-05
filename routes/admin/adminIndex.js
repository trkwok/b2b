import express from 'express';

import {adminJwt} from '../../admin/helpers/authJwt';
import Admin from './admin'
const router = express.Router();

router.use(adminJwt)
router.use('/', Admin)

export default router;
