import pool from "../database/db";
import ErrorResponse from "../errorHandler/errorResponse";
import httpStatus from "http-status";
import argon2 from "argon2";
import {createActivationToken, generateJwtToken, getEmailFromActivationToken}
    from "../helpers/authHandler";
import env from '../utils/validateENV'
import { serialize } from 'cookie';
import sendMail from "../utils/sendMail";
const loginAgent = async (req, res, next) => {

    const agentId = req.params.id;
    // Get a connection from the pool
    const {email, password} = req.body
    const connection = await pool.getConnection();

    const selectQuery = `
      SELECT *
      FROM agent
      WHERE email = ?
    `;

    const [rows] = await connection.query(selectQuery, [email]);
    connection.release(); // Release the connection back to the pool

    let agent = rows[0];
   // console.log(agent)

    if (!agent) {
        return next(new ErrorResponse(`${email} not found`, httpStatus.NOT_FOUND));
    }
    const isMatch = await argon2.verify(agent.password, password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid password', httpStatus.NOT_FOUND));
    }
    //connection.release();

    if (rows[0].affectedRows === 0) {
        return next(new ErrorResponse(`${email} not found`, httpStatus.NOT_FOUND))
    }

    if (agent.status !== 'approved') {
        return next(new ErrorResponse(`${agent.first_name} please wait, we verify your profile`));
    }


    const token = generateJwtToken(agent.email, agent.id);
     agent = {
        ...agent,
        token
    };
    // Remove 'password' and 'agent_id' fields from the new object

    delete agent.password;
     const tokenAge =  (parseInt(env.JWT_EXPIRES_IN,10)) * 24 * 3600
    const cookieOptions = {
        httpOnly: true, // Make the cookie accessible only via HTTP (not JavaScript)
        maxAge: tokenAge, // Set the cookie to expire after a certain time (e.g., 1 hour)
        sameSite: 'strict', // Restrict the cookie to same-site requests only
        secure: true, // Require HTTPS to send the cookie (in production)
    };

    const cookieString = serialize('token', token, cookieOptions);
    res.cookie('token', cookieString, cookieOptions);
   // document.cookie = cookieString;


    return agent

}


const forgotPassword = async (req, res, next) => {

    const { email } = req.body;


        // Check if the provided email exists in the database
        const [checkResult] = await pool.query('SELECT * FROM agent WHERE email = ?', [email]);

        if (checkResult.length === 0) {
            return next(new ErrorResponse('Email not found', 404));
        }

        // Generate a reset token
        const resetToken = createActivationToken({ email });

        await sendMail({
            email: email,
            subject: 'Activate your account',
            message: `Hello there, please click on the link to activate your account: ${resetToken}`,
        });

        return({
            success: true,
            message: `Please check your email: ${email} to activate your account!`,
        });

    }


    const  resetPassword = async (req, res, next) => {

        const { resetToken, newPassword, confirmPassword } = req.body;
     //   console.log('hi')
        console.log(newPassword,confirmPassword)

        if (newPassword !== confirmPassword) {
            return next(new ErrorResponse('Passwords do not match', 404));
        }

        const email = getEmailFromActivationToken(resetToken);

        if (!email) {
            return next(new ErrorResponse('Invalid Token', 404));
        }

        // Hash the new password
        const hash = await argon2.hash(newPassword);

        // Update the agent's password and reset token using the pool instance
        const updatePasswordQuery = `
            UPDATE agent
            SET password = ?
            WHERE email = ?
        `;

        await pool.execute(updatePasswordQuery, [hash, email]);

        return({  message: 'Password reset successfully' });
    }

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword} = req.body;
    const id = req.user.id;



        const [user] = await pool.query('SELECT * FROM agent WHERE id = ?', [id]);
       // console.log(user[0].password);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        const isCurrentPasswordValid = await argon2.verify(user[0].password, oldPassword);
      //  console.log(isCurrentPasswordValid)

        if (!isCurrentPasswordValid) {
            return next(new ErrorResponse('Invalid current password', 400));
        }

        const hash = await argon2.hash(newPassword);

        await pool.query('UPDATE agent SET password = ? WHERE id = ?', [hash, id]);

        res.status(200).json({ success: true, message: 'Password changed successfully' });

};


export const authService = {
    loginAgent,
    forgotPassword,
    resetPassword,
    changePassword
}