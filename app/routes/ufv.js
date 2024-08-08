const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getUfvPaginate, newUfv, updateUfv, activeInactiveUfv } = require('../controllers/ufv.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/ufv');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getUfvPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newUfv );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateUfv);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveUfv );


module.exports = router;