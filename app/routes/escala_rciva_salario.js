const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getEscalaRcivaPaginate, newEscalaRciva, updateEscalaRciva, activeInactiveEscalaRciva } = require('../controllers/escala_rciva_salario.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/escala_rciva_salario');

const router = Router();

router.get('/',[
    validarJWT,
    validarIsAdmin,
],getEscalaRcivaPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newEscalaRciva );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateEscalaRciva);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveEscalaRciva );

module.exports = router;