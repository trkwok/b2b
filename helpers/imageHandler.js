import catchAsyncErrors from "../errorHandler/catchAsyncErrors";
import {convertToWebP, deleteFile, removeFileExtension} from "./folderhandle";
import ErrorResponse from "../errorHandler/errorResponse";
import httpStatus from "http-status";
import pool from "../database/db";
import path from "path";
import fs from "fs";


export const imageHandler = catchAsyncErrors(async (req, res, next) => {

   // console.log(req.file)
    //console.log('here')

    // Configure pdf2pic
    if (!req.file) return next(new ErrorResponse('Select file', httpStatus.BAD_REQUEST))


    // get the image file name
    const fileName = req.file.filename
    // get base url of server
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
   // console.log(`${basePath}${fileName}`)
    // remove file extension
    const output = removeFileExtension(fileName)
    console.log(output)

    // if file is pdf
    let image
    if (req.file.mimetype === 'application/pdf') image = req.file.path
    else {
        // convert into webP
        image = await convertToWebP(req.file.path, `${output}`)
        deleteFile(req.file.path)
    }
    // save the file path for farther modify

    console.log(image)
    // set the url for insert into db
    const newOutput = image.split('\\').pop();
    const url =`${basePath}${newOutput}`
    console.log(url + '\n' + newOutput)
    req.image = image; // Use req.image, not req.image
    req.url = url; // Use req.image, not req.image
    //
    next()
})


export  const removeStoreImage =  catchAsyncErrors(async (req, res, next) => {
    const agentId = req.params.id;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
        'SELECT company_logo FROM Agent WHERE id=?',
        [agentId]
    );
    connection.release();

    if (rows.length === 0) {
        deleteFile(req.image)
        return next(new ErrorResponse('Agent not found', httpStatus.NOT_FOUND));
    }
    const { company_logo } = rows[0];
    if (!company_logo) next()
    if (company_logo) {
        const path = company_logo.split(`${req.protocol}://${req.get('host')}/`)[1]
         console.log(path)
        deleteFile(path)
        next()
    }

})

 export  const removeImageFromFolder = (folderPath, imageName) => {
    const imagePath = path.join(folderPath, imageName);
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error(`Error removing image ${imageName} from folder ${folderPath}:`, err);
        } else {
            console.log(`Image ${imageName} removed successfully from folder ${folderPath}`);
        }
    });
};



export const MultipleImageHandler = catchAsyncErrors(async (req, res, next) => {
  //  console.log(req.body)
    if (!req.files || req.files.length !== 4) {
        return next(new ErrorResponse('No files uploaded', httpStatus.BAD_REQUEST));
    }

    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const images = [];
    const urls = [];

    for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        if (!file) {
            continue;
        }

        const fileName = file.filename;
        const output = removeFileExtension(fileName);

        let image;
        if (file.mimetype === 'application/pdf') {
            image = file.path;
        } else {
            image = await convertToWebP(file.path, `${output}`);
            deleteFile(file.path);
        }

        const newOutput = image.split('\\').pop();
        const url = `${basePath}${newOutput}`;

        images.push(image);
        urls.push(url);
    }

    req.images = images;
    req.urls = urls;

    next();
});


export const removeCertificatesImages = catchAsyncErrors(async (req, res, next) => {
    const agentId = req.user.id; // Assuming you have the agent's ID in req.user.id
    const connection = await pool.getConnection();


        // Retrieve paths from the certificates table for the agent
        const [rows] = await connection.query(
            'SELECT path FROM certificates WHERE agentId=?',
            [agentId]
        );

        if (rows.length === 0) {
            // No certificates found, continue to the next middleware
            next();
            return;
        }

        // Process and delete each certificate image
        for (const row of rows) {
            const path = row.path.split(`${req.protocol}://${req.get('host')}/`)[1];
            deleteFile(path);
        }

        next();

});
