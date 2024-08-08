const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getTipoDescuentoPaginate, newTipoDescuento, updateTipoDescuento, activeInactiveTipoDescuento } = require('../controllers/tipo_descuento_sancion.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/tipo_descuento_sancion');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getTipoDescuentoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newTipoDescuento );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateTipoDescuento);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveTipoDescuento );


module.exports = router;