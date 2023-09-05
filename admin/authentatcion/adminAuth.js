import pool from '../../database/db';
import ErrorResponse from '../../errorHandler/errorResponse';
import {generateJwtToken} from '../../helpers/authHandler';
import env from '../../utils/validateENV'
import * as argon2 from 'argon2';
import httpStatus from 'http-status';
import {serialize} from 'cookie';
const loginAdmin = async (req, res, next, table) => {

  //  const Id = req.params.id;
    // Get a connection from the pool
    const {email, password} = req.body
    const connection = await pool.getConnection();

    const selectQuery = `
      SELECT *
      FROM ${table}
      WHERE email = ?
    `;

    const [rows] = await connection.query(selectQuery, [email]);
    connection.release(); // Release the connection back to the pool

    let user = rows[0];
    // console.log(agent)

    if (!user) {
        return next(new ErrorResponse(`${email} not found`, httpStatus.NOT_FOUND));
    }
    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid password', httpStatus.NOT_FOUND));
    }
    //connection.release();

    if (rows[0].affectedRows === 0) {
        return next(new ErrorResponse(`${email} not found`, httpStatus.NOT_FOUND))
    }

    /*if (user.agent_id && user.status !== 'approved') {
        return next(new ErrorResponse(`${user.email} please wait, we verify your profile`));
    }*/


    const token = generateJwtToken(user.email, user.id);
    user = {
        ...user,
        token
    };
    // Remove 'password' and 'agent_id' fields from the new object

    delete user.password;
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


    return user

}


export  const adminAuth = {
    loginAdmin
}