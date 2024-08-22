const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getDestinoPaginate, newDestino, updateDestino, activeInactiveDestino } = require('../controllers/destino.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/destino');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getDestinoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newDestino );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateDestino);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveDestino );


module.exports = router;