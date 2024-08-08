const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getSeguroPaginate, newSeguro, updateSeguro, activeInactiveSeguro } = require('../controllers/seguro.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/seguro');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getSeguroPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newSeguro );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateSeguro);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveSeguro );


module.exports = router;