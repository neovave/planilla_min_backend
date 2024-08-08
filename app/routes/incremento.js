const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getIncrementoPaginate, newIncremento, updateIncremento, activeInactiveIncremento } = require('../controllers/incremento.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/incremento');

const router = Router();

router.get('/',[
    validarJWT,
    validarIsAdmin
],getIncrementoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newIncremento );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateIncremento);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveIncremento );


module.exports = router;