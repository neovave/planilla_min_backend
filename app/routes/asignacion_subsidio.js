const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAsigSubsidioPaginate, newAsigSubsidio, updateAsigSubsidio, activeInactiveAsigSubsidio, importarSubsidio } = require('../controllers/asignacion_subsidio.controller');
const { validateDelete, getValidateUpdate, getValidateCreate, getValidateImportacion } = require('../middlewares/validators/asignacion_subsidio');
const { filesExist } = require('../middlewares/validators/validar-files');
//const multer = require('multer');
//const path = require('path');
//const storage = multer.memoryStorage();
//const upload = multer({ dest: path.join(__dirname, '../../public/upload/','temp') }); 
const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getAsigSubsidioPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    filesExist,
    getValidateCreate
],newAsigSubsidio );

router.put('/:id/:id_beneficiario', [
    validarJWT,
    validarIsAdmin,
    filesExist,
    toUpperCaseConvert,
    getValidateUpdate
],updateAsigSubsidio);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAsigSubsidio );

router.post('/importar_descuento', [
    validarJWT,
    //upload.fields([{ name: 'file', maxCount: 1 }]),
    validarIsAdmin,
    toUpperCaseConvert,
    filesExist,
    getValidateImportacion
],importarSubsidio );




module.exports = router;