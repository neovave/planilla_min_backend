const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAportePaginate, newRepPlanilla, updateAporte, activeInactiveAporte, newReport } = require('../controllers/reporte.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/aporte');



const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs');
const path = require('path');

pdfMake.vfs = pdfFonts.pdfMake.vfs; // Cargar las fuentes necesarias para pdfMake


const router = Router();


// router.get('/',[
//     validarJWT,
//     validarIsAdmin,
// ],getAportePaginate );

router.post('/planilla', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    //getValidateCreate
],newRepPlanilla );

router.post('/planilla2', [
    //validarJWT,
    //validarIsAdmin,
    //toUpperCaseConvert,
    //getValidateCreate
],newReport );

// Ruta para generar y devolver el PDF
// Ruta para generar y devolver el reporte PDF
router.post('/planilla3', async (req, res) => {
    try {
      // Datos que recibimos del request
      const { activo, gestion } = req.body;
  
      // Definimos el contenido del PDF
      const docDefinition = {
        content: [
          { text: `Reporte de Planilla - Región: `},
          { text: `Departamento: ` },
          { text: 'Contenido del reporte aquí...' },
        ]
      };
  
      // Crear el PDF en un buffer
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBuffer((buffer) => {
        // Guardar temporalmente el PDF para enviarlo
        const filePath = path.join(__dirname, 'reporte_planilla.pdf');
        fs.writeFileSync(filePath, buffer);
  
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        // Enviar el archivo PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte_planilla.pdf"');
        res.send(buffer);
  
        // Elimina el archivo temporal después de enviarlo (opcional)
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo temporal', err);
          }
        });
      });
    } catch (error) {
      console.error('Error generando el PDF:', error);
      res.status(500).send('Error generando el PDF');
    }
  });
  
// router.put('/:id', [
//     validarJWT,
//     validarIsAdmin,
//     toUpperCaseConvert,
//     getValidateUpdate
// ],updateAporte);

// router.put('/destroyAndActive/:id', [
//     validarJWT,
//     validarIsAdmin,
//     validateDelete
// ],activeInactiveAporte );


module.exports = router;