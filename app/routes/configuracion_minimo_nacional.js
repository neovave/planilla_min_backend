const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getConfigMinNacionalPaginate, newConfigMinNacional, updateConfigMinNacional, activeInactiveConfigMinNacional } = require('../controllers/configuracion_minimo_nacional.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/configuracion_minimo_nacional');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getConfigMinNacionalPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newConfigMinNacional );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateConfigMinNacional);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveConfigMinNacional );


module.exports = router;