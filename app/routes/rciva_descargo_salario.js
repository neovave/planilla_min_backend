const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getRcivaDescargoPaginate, newRcivaDescargo, updateRcivaDescargo, activeInactiveRcivaDescargo, migrarSaldoDescargo } = require('../controllers/rciva_descargo_salario.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/rciva_descargo_salario');

const router = Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',[
    validarJWT,
    validarIsAdmin
],getRcivaDescargoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newRcivaDescargo );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateRcivaDescargo);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveRcivaDescargo );

router.post('/migrar', [
    validarJWT,
    upload.fields([{ name: 'file', maxCount: 1 }, { name: 'file2', maxCount: 1 }]),
    validarIsAdmin,
    //toUpperCaseConvert,
    //getValidateCreate
],migrarSaldoDescargo );

module.exports = router;