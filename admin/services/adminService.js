import ErrorResponse from '../../errorHandler/errorResponse';
import httpStatus from 'http-status';
import * as argon2 from 'argon2';
import pool from '../../database/db';
import {deleteFile} from '../../helpers/folderhandle';

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

const changeAgentStatus = async (req, res, next) => {

// Extract the user ID from req.params
    const userId = req.params.id;


    // Check if the user with the provided ID exists in the Agent table
    const userExists = await checkUserExists(userId);
    console.log(userExists)

    if (userExists) {
        // Update the user's status and approved_by fields
        const updateResult = await approveUser(userId, req.user.id, req.body.status);

        if (updateResult) {
            return updateResult
        } else {
            return ({message: 'Failed to update user'});
        }
    } else {
        return ({message: 'User not found'});

    }
}


// Function to check if a user exists in the Agent table
async function checkUserExists(userId) {
    const connection = await pool.getConnection();
    try {
        const [user] = await connection.query('SELECT * FROM agent WHERE id = ?', [userId]);
        return user.length > 0;
    } finally {
        connection.release();
    }
}

// Function to approve a user and set the approved_by field
async function approveUser(userId, approvedById, status) {
    const connection = await pool.getConnection();
    try {
        const updateQuery = 'UPDATE Agent SET status = ?, approved_by = ? WHERE id = ?';
        const [updateResult] = await connection.query(updateQuery, [status, approvedById, userId]);
        return updateResult.affectedRows > 0;
    } finally {
        connection.release();
    }
}

export const adminService = {

    createAdmin,
    changeAgentStatus
}