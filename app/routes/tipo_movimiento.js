const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getTipoMovimientoPaginate, newTipoMovimiento, updateTipoMovimiento, activeInactiveTipoMovimiento } = require('../controllers/tipo_movimiento.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/tipo_movimiento');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getTipoMovimientoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newTipoMovimiento );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateTipoMovimiento);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveTipoMovimiento );


module.exports = router;