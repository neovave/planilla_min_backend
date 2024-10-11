const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAportePaginate, newRepPlanilla,newRepPlanillaImpositiva, newRepPlanillaSubsidio,newRepPlanillaSubsidioNew, newRepDescAcreedor,updateAporte, activeInactiveAporte, newReport } = require('../controllers/reporte.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/aporte');

const router = Router();


// router.get('/',[
//     validarJWT,
//     validarIsAdmin,
// ],getAportePaginate );

router.post('/planilla', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    //getValidateCreate
],newRepPlanilla );

router.post('/planilla_impositiva', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    //getValidateCreate
],newRepPlanillaImpositiva );

router.post('/planilla_subsidio', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    //getValidateCreate
],newRepPlanillaSubsidio );

router.post('/planilla_subsidio_dos',[
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,

], newRepPlanillaSubsidioNew );

router.post('/descuento_acreedor',[
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
], newRepDescAcreedor );
// router.put('/:id', [
//     validarJWT,
//     validarIsAdmin,
//     toUpperCaseConvert,
//     getValidateUpdate
// ],updateAporte);

// router.put('/destroyAndActive/:id', [
//     validarJWT,
//     validarIsAdmin,
//     validateDelete
// ],activeInactiveAporte );


module.exports = router;