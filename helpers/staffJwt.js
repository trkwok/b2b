import {expressjwt} from 'express-jwt';
import JWT from 'jsonwebtoken';
import ErrorResponse from '../errorHandler/errorResponse';
import env from '../utils/validateENV';
import pool from "../database/db";

// function that allows only logged-in users to access the application
function staffJwt() {
    const secret = env.JWT_SECRET;

    return expressjwt({
        secret: secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        // paths that can be accessed without verification
        path: [
            { url: /\/api\/v1\/staff\/staff_login(.*)/, methods: ['POST'] },
        ],
    });
}

async  function isRevoked(req, payload)  {
    try {
        //console.log(req);
        const token = req.headers['authorization'].split(' ')[1];
        //  console.log(token + 'kkk');
        // console.log('here');
        let user = JWT.verify(token, env.JWT_SECRET);
      //   console.log(user);
        user = await getUserById(user.id);
        req.is_staff = true;
        req.user = user[0];
        console.log(req.user)
        //req.user = user;
        //console.log(req.user);
        //  console.log(payload.payload.agentId)
        //  req.userId = payload.payload.agentId

        // Perform checks here based on user.role
        // If the user is not authorized, return done(null, true);
        // If the user is authorized, return done(null, false);
        return !( user[0]);
        // done(null, false); // Example: For now, always consider the user authorized.
    } catch (error) {
       // console.log(error)
        throw new ErrorResponse(error, 400);
    }
}

async function getUserById(id) {
    const connection = await pool.getConnection();

    try {
        const selectQuery = `
            SELECT *
            FROM staff
            WHERE id = ?
        `;
        const [user] = await connection.query(selectQuery, [id]);


        return user;
    } catch (error) {
        throw (new ErrorResponse(error, 400));
    } finally {
        connection.release(); // Release the database connection back to the pool
    }
}

export default staffJwt;