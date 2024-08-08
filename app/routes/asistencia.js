const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAsistenciaPaginate, newAsistencia, updateAsistencia, activeInactiveAsistencia } = require('../controllers/asistencia.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/asistencia');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getAsistenciaPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newAsistencia );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateAsistencia);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAsistencia );


module.exports = router;