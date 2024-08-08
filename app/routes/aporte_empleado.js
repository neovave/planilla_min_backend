const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAporteEmpPaginate, newAporteEmp, updateAporteEmp, activeInactiveAporteEmp } = require('../controllers/aporte_empleado.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/aporte_empleado');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getAporteEmpPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newAporteEmp );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateAporteEmp);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAporteEmp );


module.exports = router;