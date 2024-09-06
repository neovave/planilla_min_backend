const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getEmpNoAportantePaginate, newEmpNoAportante, updateEmpNoAportante, activeInactiveEmpNoAportante } = require('../controllers/empleado_no_aportante.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/empleado_no_aportante');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getEmpNoAportantePaginate );


router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newEmpNoAportante );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateEmpNoAportante);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveEmpNoAportante );


module.exports = router;