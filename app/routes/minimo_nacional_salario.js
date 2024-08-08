const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getMinSalarioPaginate, newMinSalario, updateMinSalario, activeInactiveMinSalario } = require('../controllers/minimo_nacional_salario.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/minimo_nacional_salario');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getMinSalarioPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newMinSalario );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateMinSalario);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveMinSalario );


module.exports = router;