const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getSalarioPlanillaPaginate, newSalarioPlanilla, generarSalarioPlanillaAll, updateSalarioPlanilla, activeInactiveSalarioPlanilla } = require('../controllers/salario_planillas.controller');
const { validateDelete, getValidateUpdate, getValidateCreate, getValidateGenerarAsis } = require('../middlewares/validators/salario_planilla');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getSalarioPlanillaPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newSalarioPlanilla );
router.post('/generar', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateGenerarAsis
],generarSalarioPlanillaAll );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateSalarioPlanilla);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveSalarioPlanilla );


module.exports = router;