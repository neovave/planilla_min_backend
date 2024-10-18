const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getGrupoDescuentoPaginate, newGrupoDescuento, updateGrupoDescuento, activeInactiveGrupoDescuento } = require('../controllers/grupo_descuento.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/grupo_descuento');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getGrupoDescuentoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newGrupoDescuento );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateGrupoDescuento);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveGrupoDescuento );


module.exports = router;