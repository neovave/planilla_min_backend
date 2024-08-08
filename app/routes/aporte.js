const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAportePaginate, newAporte, updateAporte, activeInactiveAporte } = require('../controllers/aporte.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/aporte');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getAportePaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newAporte );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateAporte);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAporte );


module.exports = router;