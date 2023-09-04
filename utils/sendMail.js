import nodemailer from 'nodemailer';
import ErrorResponse from "../errorHandler/errorResponse";
import httpStatus from "http-status";
import env from '../utils/validateENV'
const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: env.SMPT_HOST,
        port: env.SMPT_PORT,
        service: env.SMPT_SERVICE,
        secure: true,
        auth: {
            user: env.SMPT_MAIL,
            pass: env.SMPT_PASSWORD,
        },
    });

    const mailOptions = {
        from: env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new ErrorResponse(error, httpStatus.BAD_REQUEST);
    }
};

export default sendMail;
