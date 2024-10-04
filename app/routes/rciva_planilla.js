const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getRcivaPlanillaPaginate, newRcivaPlanilla, updateRcivaPlanilla, activeInactiveRcivaPlanilla,migrarSaldoRciva } = require('../controllers/rciva_planilla.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/rciva_planilla');

const router = Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',[
    validarJWT,
    validarIsAdmin
],getRcivaPlanillaPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newRcivaPlanilla );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateRcivaPlanilla);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveRcivaPlanilla );

router.post('/migrar', [
    validarJWT,
    upload.fields([{ name: 'file', maxCount: 1 }, { name: 'file2', maxCount: 1 }]),
    validarIsAdmin,
    //toUpperCaseConvert,
    //getValidateCreate
],migrarSaldoRciva );

module.exports = router;