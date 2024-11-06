const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getRcivaPlanillaPaginate, newRcivaPlanilla, updateRcivaPlanilla, activeInactiveRcivaPlanilla,migrarSaldoRciva } = require('../controllers/rciva_planilla.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/rciva_planilla');

const router = Router();

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


module.exports = router;