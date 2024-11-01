const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAsigDescuentoPaginate, newAsigDescuento, updateAsigDescuento, activeInactiveAsigDescuento, importarDescuento } = require('../controllers/asignacion_descuento.controller');
const { validateDelete, getValidateUpdate, getValidateCreate, getValidateImportacion} = require('../middlewares/validators/asignacion_descuento');
const { filesExist } = require('../middlewares/validators/validar-files');
//const multer = require('multer');
//const path = require('path');
//const storage = multer.memoryStorage();
//const upload = multer({ dest: path.join(__dirname, '../../public/upload/','temp') }); 
const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getAsigDescuentoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    filesExist,
    getValidateCreate,   
], newAsigDescuento );

router.put('/:id/:id_beneficiario', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    filesExist,
    getValidateUpdate
],updateAsigDescuento);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAsigDescuento );

router.post('/importar_descuento', [
    validarJWT,
    //upload.fields([{ name: 'file', maxCount: 1 }]),
    validarIsAdmin,
    toUpperCaseConvert,
    filesExist,
    getValidateImportacion
],importarDescuento );


module.exports = router;