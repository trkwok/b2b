import ErrorResponse from '../../errorHandler/errorResponse';
import httpStatus from 'http-status';
import * as argon2 from 'argon2';
import pool from '../../database/db';
import {deleteFile} from '../../helpers/folderhandle';
import path from 'path';

const createAdmin = async (req, res, next) => {
    try {
        if (!req.user.id) return next(new ErrorResponse('You must to login', httpStatus.BAD_REQUEST))
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

const  changeAgentStatus = async (req, res, next) => {

// Extract the user ID from req.params
    const userId = req.params.id;


    // Check if the user with the provided ID exists in the Agent table
    const userExists = await checkUserExists(req.body.status,userId);
    console.log(userExists)

    if (userExists) {
        // Update the user's status and approved_by fields
        const connection = await pool.getConnection();
        const [user] = await connection.query('SELECT * FROM agent WHERE id = ?', [userId]);
        if(req.body.status === user[0].status) {
            return  next(new ErrorResponse( `User status already in ${user[0].status}`, httpStatus.BAD_REQUEST))
        }

        const updateResult = await approveUser(next,userId, req.user.id, req.body.status);

        if (updateResult) {
            return updateResult
        } else {
            return next(new ErrorResponse( 'Failed to update user', httpStatus.FAILED_DEPENDENCY));
        }
    } else {
        return next(new ErrorResponse('User not found', httpStatus.NOT_FOUND));

    }
}


// Function to check if a user exists in the Agent table
async function checkUserExists(status,userId) {
    const connection = await pool.getConnection();
    try {
        const [user] = await connection.query('SELECT * FROM agent WHERE id = ?', [userId]);
      //  console.log(user)
        return user.length > 0;
    } finally {
        connection.release();
    }
}

// Function to approve a user and set the approved_by field
async function approveUser(next,userId, approvedById, status) {
    const connection = await pool.getConnection();
    try {


        const updateQuery = 'UPDATE Agent SET status = ?, approved_by = ? WHERE id = ?';
        const [updateResult] = await connection.query(updateQuery, [status, approvedById, userId]);
       // console.log(updateResult)
        if(updateResult.affectedRows > 0) {
            const [user] = await connection.query('SELECT * FROM agent WHERE id = ?', [userId]);
            delete user[0].password
            console.log(status, user[0].status)
            if(status === user[0].status)
            return user[0]
        }
        return false
    } finally {
        connection.release();
    }
}

export const adminService = {

    createAdmin,
    changeAgentStatus
}