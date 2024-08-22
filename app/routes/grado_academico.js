const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getGradoAcademicoPaginate, newGradoAcademico, updateGradoAcademico, activeInactiveGradoAcademico } = require('../controllers/grado_academico.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/grado_academico');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getGradoAcademicoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newGradoAcademico );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateGradoAcademico);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveGradoAcademico );


module.exports = router;