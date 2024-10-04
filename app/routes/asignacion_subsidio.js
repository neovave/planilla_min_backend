const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAsigSubsidioPaginate, newAsigSubsidio, updateAsigSubsidio, activeInactiveAsigSubsidio } = require('../controllers/asignacion_subsidio.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/asignacion_subsidio');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getAsigSubsidioPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newAsigSubsidio );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateAsigSubsidio);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAsigSubsidio );


module.exports = router;