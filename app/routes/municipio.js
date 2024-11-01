const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getMunicipioPaginate, newMunicipio, updateMunicipio, activeInactiveMunicipio } = require('../controllers/municipio.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/municipio');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getMunicipioPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newMunicipio );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateMunicipio);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveMunicipio );


module.exports = router;