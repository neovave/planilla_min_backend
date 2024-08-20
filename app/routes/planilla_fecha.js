const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getPlanillaFechaPaginate, newPlanillaFecha, updatePlanillaFecha, activeInactivePlanillaFecha, getPlanillaFechaRciva } = require('../controllers/planilla_fecha.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/planilla_fecha');

const router = Router();

router.get('/',[
    validarJWT,
    validarIsAdmin
],getPlanillaFechaPaginate );

router.get('/rciva/',[
    validarJWT,
    validarIsAdmin
],getPlanillaFechaRciva );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newPlanillaFecha );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updatePlanillaFecha);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactivePlanillaFecha );


module.exports = router;