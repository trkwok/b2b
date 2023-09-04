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
