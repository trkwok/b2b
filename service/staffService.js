// Create a function to create a new staff member
import pool from "../database/db";
import argon2 from "argon2";
import ErrorResponse from "../errorHandler/errorResponse";
import httpStatus from "http-status";

const createStaffMember = async (req,res) => {
        const { staff_name, email, password, staff_designation, staff_phone, role } = req.body;
        console.log(req.body)
        const created_by = req.user.id
        if (!created_by){
                throw new Error('User not found')
        }
        const hash = await argon2.hash(password);
        // Create a new staff member in the database
        const connection = await pool.getConnection();

        const [results] = await connection.query(
            'INSERT INTO Staff (staff_name, email, password, staff_designation, staff_phone, role, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [staff_name, email,hash, staff_designation, staff_phone, role, created_by]
        );
        connection.release();
        // Return the newly created staff member
        return results.insertId;// You can return the newly created staff member's ID or any other relevant data

};
const getStaffMembers = async () => {
        const connection = await pool.getConnection();
        try {
                const [rows] = await connection.query('SELECT * FROM Staff');
                return rows;
        } finally {
                connection.release();
        }
};

const staffUpdate = async (req, res, next) => {
        const id = req.params.id;

        // Extract fields that can be updated
        const { staff_name, staff_phone,email,password,staff_designation,role } = req.body;
        const hash = await argon2.hash(password);
        const connection = await pool.getConnection();
        // Update the specified fields in the Staff table
        const [rows] = await connection.query(
            'UPDATE Staff SET staff_name=?, staff_phone=?,email=?,password=?,staff_designation=?,role=? WHERE id=?',
            [staff_name, staff_phone,email,hash,staff_designation,role,id]
        );
        connection.release();

        if (rows.affectedRows === 0) {
                return next(new ErrorResponse('Staff not found', httpStatus.NOT_FOUND));
        }

        return rows;
};


export const staffService ={
    createStaffMember, getStaffMembers,staffUpdate
};
