import express from "express";
import { depositController } from "../../agent/controller/depositController";
import {
    depositRequestValidationRules,
} from '../../utils/depositeValidator';
import { isRequestValidated } from "../../utils/validator";
import { upload } from "../../utils/fileUploader";
import {imageHandler} from '../../helpers/imageHandler';

const router = express.Router();



router.route("/create_deposit_request")
    .post(
        upload.single("transaction_file"),
        imageHandler,
        depositRequestValidationRules,
        isRequestValidated,

        depositController.createDepositRequestController
    );



export default router;