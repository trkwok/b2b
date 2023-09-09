import { body } from "express-validator";

exports.depositRequestValidationRules = [
        body('deposited_from').optional().isString(),
        body('deposited_to').optional().isString().trim(),
        body('deposit_type').isIn(['bank_transfer', 'cheque_deposit', 'cash_deposit']),
        body('user_id').optional().isString().trim(),
        body('transaction_id').isString().trim().notEmpty()
            .withMessage('translation id must be provided'),
        body('payment_way').isString().trim().notEmpty()
            .withMessage('payment way must be provided'),
        body('payment_method').isString().trim().notEmpty()
            .withMessage('payment method must be provided'),
        body('cheque_issue_date').optional({ nullable: true }).isDate(),
        body('ref').isString().trim().notEmpty()
            .withMessage('payment method must be provided'),
        body('amount').isDecimal({ decimal_digits: '1,2' }).notEmpty()
            .withMessage('provide your payment'), // Adjust the decimal validation as needed
];


exports.updateStatusValidationRules = [
        body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status value'),
        body('remarks').isString().trim().notEmpty().withMessage('Invalid description')

];