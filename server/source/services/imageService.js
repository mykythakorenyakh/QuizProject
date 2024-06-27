const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

function getFileExtension(base64String) {
    // Split the base64 string to separate the metadata from the data
    const matches = base64String.match(/^data:(.*);base64,/);
    
    // Check if the matches contain the MIME type
    if (matches && matches.length > 1) {
        const mimeType = matches[1];
        // Use a dictionary or map to translate MIME types to file extensions
        const mimeToExt = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/bmp': 'bmp',
            'image/svg+xml': 'svg',
            'image/webp': 'webp',
            // Add more MIME types and corresponding extensions as needed
        };

        return mimeToExt[mimeType] || 'unknown'; // Return the extension or 'unknown' if not found
    }
    
    return 'unknown';
}


const saveImage=(fileName,base64string)=>{

    const base64Image = base64string.split(';base64,').pop();

    
    const ext = getFileExtension(base64string);
    const filePath = path.join(__dirname,'../../','public/images',fileName +"."+ ext);
    

    fs.writeFileSync(filePath, base64Image, {encoding: 'base64'}, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File saved successfully.');
        }
    });

    return fileName +"."+ ext;
}

const stringIsLink=(str)=>{
    return !str.startsWith('data');

}

const deleteImage = (fileName)=>{
    fs.unlinkSync(path.join(__dirname,'../../','public/images',fileName));
}

const initImage=(img)=>{
    var image = null
    if (img) {

        if (typeof img === 'object') {
            deleteImage(img.data.replace(`http://localhost:8888/images/`,''))
        } else {
            if (!stringIsLink(img)) {
                image = `http://localhost:8888/images/` + saveImage(uuid.v7(), img);
            
            } else {
                image = img;
            
            }
        }
    }
    return image;
}


module.exports = {
    saveImage,
    stringIsLink,
    deleteImage,
    initImage,
}