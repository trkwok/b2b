import pool from '../database/db';
import {convertToWebP, deleteFile, removeFileExtension} from "../helpers/folderhandle";
import argon2 from 'argon2';
import ErrorResponse from "../errorHandler/errorResponse";
import httpStatus from "http-status";
import {removeImageFromFolder} from "../helpers/imageHandler";
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
    const agentId = req.user.id;
    console.log(req.files);

    if (!req.files || req.files.length !== 4) {
        return next(new ErrorResponse('Images not found', 400));
    }

    const imagePaths = [];
    const imageNames = [];

    for (let i = 0; i < req.files.length; i++) {
        console.log('here');
        const file = req.files[i];
        const type = req.body.types[i];
        const path = req.protocol + '://' + req.get('host') +'/public'+ '/uploads/' + file.filename;
        imagePaths.push({ type: type, path: path });
        imageNames.push(file.filename);
    }

    const selectPathsQuery = `
        SELECT path
        FROM certificates
        WHERE agentId = ?
    `;

    const deleteQuery = `
        DELETE FROM certificates
        WHERE agentId = ?
    `;

    const insertQuery = `
        INSERT INTO certificates (type, path, agentId)
        VALUES (?, ?, ?)
    `;

    try {
        const connection = await pool.getConnection();

        // First, retrieve existing certificate paths for the agent
        const [selectResult] = await connection.query(selectPathsQuery, [agentId]);

        // Remove existing images from the folder
        selectResult.forEach(function (row) {
            const path = row.path;
            console.log(path);
            const imageNameFromPath = path.substring(path.lastIndexOf('/') + 1);
            removeImageFromFolder('public/uploads', imageNameFromPath);
        });

        // Next, delete existing certificates for the agent
        await connection.query(deleteQuery, [agentId]);

        // Finally, insert the new certificates and convert images to PDF
        const insertedCertificates = [];
        let errorOccurred = false;

        for (const imagePath of imagePaths) {
            if (!errorOccurred) {
                try {
                    // Create a PDF document
                    const pdfDoc = new PDFDocument();
                    const pdfPath = `public/uploads/${imagePath.path.substring(imagePath.path.lastIndexOf('/') + 1)}.pdf`;
                    const pdfStream = fs.createWriteStream(pdfPath);

                    // Check if the image file exists
                    if (fs.existsSync(imagePath)) {
                        // Add the image to the PDF
                        pdfDoc.image(imagePath, 0, 0, { width: 612, height: 792 });

                        // End the PDF document and save it
                        pdfDoc.end();
                        pdfDoc.pipe(pdfStream);

                        // Insert the PDF path into the database
                        const [result] = await connection.query(insertQuery, [imagePath.type, pdfPath, agentId]);
                        insertedCertificates.push([imagePath.type, pdfPath, agentId]);
                    } else {
                        console.error('Image file not found:', imagePath);
                    }
                } catch (error) {
                    console.error('Error inserting certificates:', error);
                    imageNames.forEach(function (imageName) {
                        const imageNameFromPath = imageName.substring(imageName.lastIndexOf('/') + 1);
                        removeImageFromFolder('public/uploads', imageNameFromPath);
                    });
                    errorOccurred = true;
                    next(new ErrorResponse(error, 500));
                }
            }
        }

        connection.release();

        if (!errorOccurred) {
            res.status(200).json({ success: true, data: insertedCertificates });
        }
    } catch (error) {
        console.error('Error processing certificates:', error);
        imageNames.forEach(function (imageName) {
            const imageNameFromPath = imageName.substring(imageName.lastIndexOf('/') + 1);
            removeImageFromFolder('public/uploads', imageNameFromPath);
        });
        next(new ErrorResponse(error, 500));
    }
};


export const agentService = {
    createAgent,
    updateAgent,
    cms,
    updateCertificates
}