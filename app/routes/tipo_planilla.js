const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getTipoPlanillaPaginate, newTipoPlanilla, updateTipoPlanilla, activeInactiveTipoPlanilla } = require('../controllers/tipo_planilla.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/tipo_planilla');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getTipoPlanillaPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newTipoPlanilla );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateTipoPlanilla);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveTipoPlanilla );


module.exports = router;