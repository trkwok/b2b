// Create a function to create a new staff member
import pool from "../database/db";
import argon2 from "argon2";

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
         Return the newly created staff member
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



export const staffService ={
    createStaffMember, getStaffMembers,
};
