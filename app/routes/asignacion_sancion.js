const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAsigSancionPaginate, newAsigSancion, updateAsigSancion, activeInactiveAsigSancion } = require('../controllers/asignacion_sancion.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/asignacion_sancion');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getAsigSancionPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newAsigSancion );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateAsigSancion);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAsigSancion );


module.exports = router;