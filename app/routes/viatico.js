const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getViaticoEmpPaginate, newViaticoEmp, updateViaticoEmp, activeInactiveViaticoEmp } = require('../controllers/viatico.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/viatico');

const router = Router();

router.get('/',[
    validarJWT,
    validarIsAdmin
],getViaticoEmpPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newViaticoEmp );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateViaticoEmp);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveViaticoEmp );


module.exports = router;