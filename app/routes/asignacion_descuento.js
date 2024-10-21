const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAsigDescuentoPaginate, newAsigDescuento, updateAsigDescuento, activeInactiveAsigDescuento, importarDescuento } = require('../controllers/asignacion_descuento.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/asignacion_descuento');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getAsigDescuentoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newAsigDescuento );

router.put('/:id/:id_beneficiario', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateAsigDescuento);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAsigDescuento );

router.post('/importar_descuento', [
    validarJWT,
    upload.fields([{ name: 'file', maxCount: 1 }, { name: 'file2', maxCount: 1 }]),
    validarIsAdmin,
    //toUpperCaseConvert,
    //getValidateCreate
],importarDescuento );


module.exports = router;