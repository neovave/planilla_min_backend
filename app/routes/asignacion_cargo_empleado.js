const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAsigCargoEmpPaginate, newAsigCargoEmp, updateAsigCargoEmp, activeInactiveAsigCargoEmp, updateRetiroAsigCargoEmp } = require('../controllers/asignacion_cargo_empleado.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/asignacion_cargo_empleado');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getAsigCargoEmpPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newAsigCargoEmp );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateAsigCargoEmp);

router.put('/retiro/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateRetiroAsigCargoEmp);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAsigCargoEmp );


module.exports = router;