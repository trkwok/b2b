

import express from 'express';
import path from 'path';
import multer from 'multer';


// define image type
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'application/pdf' : 'pdf',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type')
        if (isValid) uploadError = null
        cb(uploadError, 'public/uploads')

    },
    filename: function (req, file, cb) {
        console.log(req)
        const uniqueSuffix = file.originalname.split(' ').join('-');
        // get the type of file
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${uniqueSuffix}-${Date.now()}.${extension}`)
    },
});

// Define the fileFilter function within the multer options object
const fileFilter = (req, file, cb) => {
    // Implement your file filter logic here
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, JPG, and PDF files are allowed.'), false); // Reject the file
    }
};


export const upload = multer({
    storage: storage,
   // fileFilter: fileFilter, // Use the fileFilter function directly
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
