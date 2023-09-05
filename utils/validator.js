import { body, validationResult } from 'express-validator'
import ErrorResponse from "../errorHandler/errorResponse";

exports.validateSignupRequest = [
    body('first_name')
        .notEmpty()
        .withMessage('firstName is required'),
    body('last_name')
        .notEmpty()
        .withMessage('lastName is required'),
    body('email')
        .isEmail()
        .withMessage('Valid Email is required'),
    body('password')
        .isLength({ min: 8, max: 12 })
        .withMessage('Password must be between 8 and 12 characters long'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;
        }),
    body('company_name').notEmpty().withMessage('Company name is required'),
    body('company_address').notEmpty().withMessage('Company address is required'),
];

exports.validateAdmin = [
    body('first_name')
        .notEmpty()
        .withMessage('firstName is required'),
    body('last_name')
        .notEmpty()
        .withMessage('lastName is required'),
    body('email')
        .isEmail()
        .withMessage('Valid Email is required'),
    body('password')
        .isLength({ min: 8, max: 12 })
        .withMessage('Password must be between 8 and 12 characters long'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;
        }),
]

exports.agentStatusUpdate = [
    body('status')
        .notEmpty()
        .withMessage('Status field must not be empty')
        .isIn(['approved', 'rejected'])
        .withMessage('Status must be either "approved" or "rejected"'),
]

exports.updateAgentRequest = [

    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('company_name').notEmpty().withMessage('Company name is required'),
    body('company_address').notEmpty().withMessage('Company address is required'),
    body('contact_number').notEmpty()
        .withMessage('Invalid phone number'),
    body('nid_number').optional().isString().withMessage('NID number must be a string'),
    body('tin_number').optional().isString().withMessage('TIN number must be a string'),
    body('passport_number').optional().isString().withMessage('Passport number must be a string'),
    body('country').optional().isString().withMessage('Country must be a string'),


]

exports.validateSigninRequest = [
    body('email')
        .isEmail()
        .withMessage('Valid Email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password can not be empty')
];

// validate cms item
exports.validateCmsItem = [
    body('firstColor').notEmpty().isString().withMessage('First color is required'),
    body('secondColor').notEmpty().isString().withMessage('Second color is required'),
    body('thirdColor').notEmpty().isString().withMessage('Third color required'),

]

exports.validateFormData = [
    body('email').isEmail().withMessage('Invalid email format'),
]

exports.validateResetPasswordData = [

    body('newPassword').notEmpty().isLength({min: 8, max: 12})
        .withMessage('Password is must be minimum 8 characters and maximum 12 characters'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                console.log(req.body.newPassword, req.body.confirmPassword);
                throw new Error('Passwords must match');
            }
            return true;
        }),
    body('resetToken').isString().withMessage('token is required')
]

// change password validation
exports.validateChangePasswordData = [
    body('oldPassword').notEmpty().isLength({min: 8, max: 12})
        .withMessage('Invalid old password'),
    body('newPassword').notEmpty().isLength({min: 8, max: 12})
        .withMessage('New password is must be minimum 8 characters and maximum 12 characters'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                console.log(req.body.newPassword, req.body.confirmPassword);
                throw new Error('Passwords must match');
            }
            return true;
        }),
]
const validRoles = ['admin', 'reservation_officer', 'manager', 'operation_executive', 'staff'];

// Validation middleware for staff creation
exports.validateStaffCreation = [
    body('staff_name').notEmpty().withMessage('Staff name is required'),
    body('email').notEmpty().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().isLength({ min: 6, max: 12 }).withMessage('Password must be 6 to 12 characters long'),
    body('staff_designation').notEmpty().withMessage('Staff designation is required'),
    body('staff_phone')
        .notEmpty()
        .withMessage('Staff phone is required'),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .custom((value) => {
            if (!validRoles.includes(value)) {
                throw new Error('Invalid role');
            }
            return true;
        }),
];
exports.staffUpdateValidators = [
    body('staff_name').not().isEmpty().withMessage('Staff name is required'),
    body('staff_phone').not().isEmpty().withMessage('Staff phone is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('staff_designation').not().isEmpty().withMessage('Staff designation is required'),
    body('role').isIn(['admin', 'reservation_officer', 'manager', 'operation_executive', 'staff']).withMessage('Invalid role'),
];


exports.isRequestValidated = async (req, res, next) => {
   // console.log(req.body)
    const errors = validationResult(req);
    console.log(errors)

    if (errors.array().length > 0) {
        next(new ErrorResponse(errors.array()[0].msg, 401))
    }
    next();
}
