const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getReparticionPaginate, newReparticion, updateReparticion, activeInactiveReparticion } = require('../controllers/reparticion.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/reparticion');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getReparticionPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newReparticion );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateReparticion);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveReparticion );


module.exports = router;