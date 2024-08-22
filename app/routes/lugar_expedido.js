const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getLugarExpedidoPaginate, newLugarExpedido, updateLugarExpedido, activeInactiveLugarExpedido } = require('../controllers/lugar_expedidos.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/lugar_expedido');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getLugarExpedidoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newLugarExpedido );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateLugarExpedido);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveLugarExpedido );


module.exports = router;