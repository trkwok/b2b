
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fromPath } from "pdf2pic";
 export const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File '${filePath}' removed.`);
    } else {
        console.log(`File '${filePath}' not found.`);
    }
};

 /// other format to webP
 export const convertToWebP = async (inputPath, outputPath) => {
     console.log(inputPath, outputPath);
     const webpOutputPath = path.join( 'public', 'uploads', outputPath + '.webp');
    return new Promise(async (resolve, reject) => {
        try {
            await sharp(inputPath)
                .webp() // Convert to WebP format
                .toFile(webpOutputPath);
            console.log(`File '${webpOutputPath}' created.`);
            resolve(webpOutputPath);
        } catch (error) {
            reject(error);
        }
    });
};

// remove file extension
 export  function removeFileExtension(filename) {
    // Use a regular expression to remove known file extensions
    const cleanedFilename = filename.replace(/\.(png|jpg|jpeg|pdf)$/i, '');

    // Optionally, you can remove trailing hyphens or underscores
    const finalFilename = cleanedFilename.replace(/[-_]+$/, '');

    return finalFilename;
}

// pdf to jepg
export async function  pdfToJepg(req, fileName, next) {

    try {

        const  options = {
            density: 100,  // Image quality (DPI)
            savename: `${fileName}`, // Prefix for output image files
            savedir: './public/uploads',
            format: "png",// Output directory for temporary images
            width: 600,
            height: 600
        };

        // Convert the PDF to images
        console.log(req.file.path, options)
        const convert = fromPath(req.file.path, options);
        console.log(convert)
        const pageToConvertAsImage = 1;

        const result = await convert(pageToConvertAsImage, { responseType: 'image' })
        console.log(result)
       // req.image = result;
        return result;
        /*let opts = {
            format: 'jpeg',
            out_dir: path.dirname(req.file.path),
            out_prefix: path.baseName(file, path.extname(file)),
            page: null
        }

        pdf.convert(file, opts)
            .then(res => {
                console.log('Successfully converted');
            })
            .catch(error => {
                console.error(error);
            })
*/
       // res.json({ images: jpegImages }); // Respond with the converted JPEG images
    } catch (error) {
        console.error('Error converting PDF to JPEG:', error);
       next(error)
    }
}


