import express from "express";
import { depositController } from "../agent/controller/depositController";
import {
    validateBankTransfer,
    validateCashDeposit,
    validateChequeDeposit,
} from "../utils/depositeValidator";
import { isRequestValidated } from "../utils/validator";
import { upload } from "../utils/fileUploader";
import {imageHandler} from '../helpers/imageHandler';

const router = express.Router();

router
    .route("/create_bank_transfer")
    .post(
        upload.single("transaction_file"),
        imageHandler,
        validateBankTransfer,
        isRequestValidated,
        depositController.createBankTransfer
    );
router
    .route("/create_cheque_transfer")
    .post(
        upload.single("transaction_file"),
        imageHandler,
        validateChequeDeposit,
        isRequestValidated,
        depositController.createCashDeposit
    );
router
    .route("/create_cash_deposit")
    .post(
        upload.single("transaction_file"),
        imageHandler,
        validateCashDeposit,
        isRequestValidated,
        depositController.createCashDeposit
    );

export default router;