import pool from '../../database/db';
import {convertToWebP, deleteFile, removeFileExtension} from "../../helpers/folderhandle";
import argon2 from 'argon2';
import ErrorResponse from "../../errorHandler/errorResponse";
import httpStatus from "http-status";
import {removeImageFromFolder} from "../../helpers/imageHandler";
import PDFDocument from "pdfkit";
import fs from "fs";


const createAgent = async (req, res, next) => {

    try {

        const {email, password, company_name, first_name, last_name, company_address} = req.body;
        // remove file extension

        // console.log(req.image); // Now req.image should be defined
        // delete original file
        // deleteFile(req.file.path)
        // insert into database
        // hash the password

        const hash = await argon2.hash(password);
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'INSERT INTO Agent (email, password, company_name, first_name, last_name, company_address, tin_file) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, hash, company_name, first_name, last_name, company_address, req.url]
        );
        connection.release();

        return rows

        // return `${basePath}${fileName}`

    } catch (err) {
        console.log(req.image)
        deleteFile(req.image)
        console.log(err)
        next(err);
    }
}

const updateAgent = async (req, res, next) => {

    const agentId = req.user.id;
    // console.log(agentId)
    // console.log(req.url)
    const {
        first_name, last_name, company_name, company_address,
        tin_number,        // Add these fields
        nid_number,        // Add these fields
        passport_number,   // Add these fields
        contact_number,
    } = req.body;

    //   const company_logo =


    const connection = await pool.getConnection();
    const [rows] = await connection.query(
        'UPDATE Agent SET first_name=?, last_name=?, company_name=?, company_address=?, tin_number=?, nid_number=?, passport_number=?, contact_number=?, company_logo=? WHERE id=?',
        [first_name, last_name, company_name, company_address, tin_number, nid_number, passport_number, contact_number, req.url, agentId]
    );
    connection.release();
    console.log(rows)

    if (rows.affectedRows === 0) {
        console.log(req.image)
        deleteFile(req.image)

        return next(new ErrorResponse('Agent not found', httpStatus.NOT_FOUND))
    }

    return rows

}


const cms = async (req, res, next) => {
    const agentId = req.user.id;
    const {firstColor, secondColor, thirdColor} = req.body;

    // Check if the user exists in the agent table
    const [user] = await pool.query('SELECT id FROM agent WHERE id = ?', [agentId]);

    if (user.length === 0) {
        return next('Agent not found', httpStatus.NOT_FOUND);
    }

    // Delete previous entries for the user
    await pool.query('DELETE FROM cms WHERE agentId = ?', [agentId]);

    // Insert new data
    await pool.query('INSERT INTO cms (agentId, first_color, second_color, third_color) VALUES (?, ?, ?, ?)', [agentId, firstColor, secondColor, thirdColor]);

    // Fetch the newly inserted data
    const [insertedData] = await pool.query('SELECT * FROM cms WHERE agentId = ?', [agentId]);
    return insertedData
}

const updateCertificates = async (req, res, next) => {
    //console.log(req)
    try {
        const agentId = req.user.id; // Assuming you have the agent's ID in req.user.id
        const connection = await pool.getConnection();
       // console.log(req)
        // Prepare the SQL INSERT statement

        // Delete existing certificates for the agent
        const deleteQuery = `
            DELETE FROM certificates
            WHERE agentId = ?
        `;

        await connection.query(deleteQuery, [agentId]);
        const insertQuery = `
            INSERT INTO certificates (type, path,  agentId)
            VALUES (?, ?, ?)
        `;

        const insertedCertificates = [];

        // Check if req.types, req.urls, and req.images are defined and have the same length
        if (
            req.body.types &&
            req.urls &&
            req.images &&
            req.body.types.length === req.urls.length &&
            req.body.types.length === req.images.length
        ) {
            // Iterate through the arrays and insert data
            for (let i = 0; i < req.body.types.length; i++) {
                const type = req.body.types[i];
                const path = req.urls[i];
                console.log(type, path);

                // Insert the data into the certificates table
                const [insertResult] = await connection.
                query(insertQuery, [type, path, agentId]);
                console.log(insertResult)
                // Store the inserted certificate in the array
                insertedCertificates.push({ type, path });
            }

            connection.release();

            // Return the inserted certificates if successful
            return  insertedCertificates;
        } else {
            // If the arrays are not defined or don't have the same length, handle the error
            for (const imagePath of req.images) {
                deleteFile(imagePath);
            }
            next( new ErrorResponse('Invalid input data', httpStatus.BAD_REQUEST));
        }
    } catch (error) {
        console.error('Error inserting certificates:', error);

        // Delete the images on failure
        for (const imagePath of req.images) {
            deleteFile(imagePath);
        }

        next(new ErrorResponse('Error inserting certificates', httpStatus.INTERNAL_SERVER_ERROR));
    }
};


export const agentService = {
    createAgent,
    updateAgent,
    cms,
    updateCertificates
}