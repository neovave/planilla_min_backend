const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getSeguroEmpPaginate, newSeguroEmp, updateSeguroEmp, activeInactiveSeguroEmp } = require('../controllers/seguro_empleado.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/seguro_empleado');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getSeguroEmpPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newSeguroEmp );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateSeguroEmp);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveSeguroEmp );


module.exports = router;