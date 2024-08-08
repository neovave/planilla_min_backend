const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getRcivaCertPaginate, newRcivaCert, updateRcivaCert, activeInactiveRcivaCert } = require('../controllers/rciva_certificacion.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/rciva_certificacion');

const router = Router();

router.get('/',[
    validarJWT,
    validarIsAdmin
],getRcivaCertPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newRcivaCert );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateRcivaCert);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveRcivaCert );


module.exports = router;