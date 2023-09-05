import ErrorResponse from '../../errorHandler/errorResponse';
import httpStatus from 'http-status';
import * as argon2 from 'argon2';
import pool from '../../database/db';
import {deleteFile} from '../../helpers/folderhandle';

const createAdmin = async (req, res, next) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        const hash = await argon2.hash(password);
        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO admin ( first_name, last_name, email, password, role, img,created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hash, 'admin', req.url, req.user.id]
        );
        connection.release();
        // Return the newly created staff member
        if (!result.insertId) {
            console.log(req.image)
            deleteFile(req.image)
        }
        return result.insertId;// You can return the newly created staff member's ID or any other relevant data
    } catch (error) {
        console.log(req.image)
        deleteFile(req.image)
        next(error);
    }

};

export const adminService = {

    createAdmin
}