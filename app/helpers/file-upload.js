const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require("fs");



const fileMoveAndRemoveOld = (file, fileOldName, idFrom,directory = 'img', extensionsAccept = [ 'png', 'PNG','jpg', 'JPG', 'jpeg', 'JPEG', 'pdf','PDF']) => {
    return new Promise((resolve, reject) => {
        const nameSplit = file.name.split('.');
        const ext = nameSplit[nameSplit.length - 1];
        if (!extensionsAccept.includes(ext)) {
            return reject( `La extensión ${ext} del file no es permitida, solo se permiten: ${extensionsAccept}` );
        }
        const nameFileTempo = `${uuidv4()}-${idFrom}.${ext}`;
        const uploadPath = path.join(__dirname, '../../uploads/', directory, nameFileTempo);
        console.log("file upload path:", uploadPath);
        file.mv(uploadPath, (err) => {
            //if (err) { reject(err); }
            if (err) {
                console.error('Error al mover el archivo:', err);
                //return res.status(500).send('Error al procesar el archivo');
            }
            // deleteFile(
            //     path.join(__dirname, '../../uploads/', directory, fileOldName)
            // );
            resolve(nameFileTempo);
        }
         )
    })
}

const deleteFile = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
};


module.exports = {
    fileMoveAndRemoveOld
}