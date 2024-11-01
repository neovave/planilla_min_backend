const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require("fs");


// Helper para guardar un archivo en un directorio específico
// async function saveFile(file, targetDir = '../uploads/destino') {
//     try {
//       // Asegurarse de que el directorio de destino existe
//       const uploadPath = path.join(__dirname, targetDir);
//       if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath, { recursive: true });
//       }
  
//       // Generar un nombre único para el archivo
//       const fileExtension = path.extname(file.originalname);
//       const newFileName = `${uuidv4()}${fileExtension}`;
//       const finalPath = path.join(uploadPath, newFileName);
//       console.log("file path:", file.path, "final path:", finalPath);

//       // Mover el archivo desde la ubicación temporal de Multer al directorio de destino
//       await fs.promises.rename(file.path, finalPath);
  
//       // Devolver el nombre y la ruta del archivo guardado
//       return {
//         fileName: newFileName,
//         filePath: finalPath,
//       };
//     } catch (error) {
//       console.error('Error al guardar el archivo:', error);
//       throw error;
//     }
//   }

const fileMoveAndRemoveOld = (file, fileOldName, idFrom,directory = 'img', extensionsAccept = [ 'png', 'PNG','jpg', 'JPG', 'jpeg', 'JPEG', 'pdf','PDF']) => {
    return new Promise((resolve, reject) => {
        const nameSplit = file.name.split('.');
        const ext = nameSplit[nameSplit.length - 1];
        if (!extensionsAccept.includes(ext)) {
            return reject( `La extensión ${ext} del file no es permitida, solo se permiten: ${extensionsAccept}` );
        }
        const nameFileTempo = `${uuidv4()}-${idFrom}.${ext}`;
        const uploadPath = path.join(__dirname, '../uploads/', directory, nameFileTempo);
        // Generar un nombre de archivo único y especificar la carpeta de destino
        // const newFileName = `${uuidv4()}${path.extname(file.name)}`;
        // const targetDir = path.join(__dirname, 'uploads/destino');
        // const targetPath = path.join(targetDir, newFileName);
         // Crear el directorio si no existe
        // if (!fs.existsSync(targetDir)) {
        //     fs.mkdirSync(targetDir, { recursive: true });
        // }
        // file.mv(targetPath, (err) => {
        //     if (err) {
        //       console.error('Error al mover el archivo:', err);
        //       return res.status(500).send('Error al procesar el archivo');
        //     }
        
        //     res.send({
        //       message: 'Archivo subido y movido con éxito',
        //       fileName: newFileName,
        //     });
        //   });

        // console.log("file upload path:", uploadPath);
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

// const deleteFile = (path) => {
//     if (fs.existsSync(path)) {
//         fs.unlinkSync(path);
//     }
// };


// Función para guardar un archivo en un directorio específico
// async function saveFile(file, targetDir = '../../uploads/destino') {
//     try {
//       // Asegurarse de que el directorio de destino existe
//       const uploadPath = path.join(__dirname, targetDir);
//       if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath, { recursive: true });
//       }
//       console.log("...............................:", file.fieldname);
//       // Generar un nombre único para el archivo
//       const fileExtension = path.extname(file.originalname);
//       const newFileName = `${uuidv4()}${fileExtension}`;
//       const filePath = path.join(uploadPath, newFileName);
  
//       // Mover el archivo al directorio de destino
//       await file.mv(filePath);
      
//       // Devolver el nombre y la ruta del archivo guardado
//       return {
//         fileName: newFileName,
//         filePath: filePath,
//       };
//     } catch (error) {
//       console.error('Error al guardar el archivo:', error);
//       throw error;
//     }
//   }
module.exports = {
  fileMoveAndRemoveOld
}