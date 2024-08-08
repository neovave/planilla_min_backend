const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getMesPaginate, newMes, updateMes, activeInactiveMes } = require('../controllers/mes.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/mes');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getMesPaginate );

// router.post('/', [
//     validarJWT,
//     validarIsAdmin,
//     toUpperCaseConvert,
//     getValidateCreate
// ],newMes );

// router.put('/:id', [
//     validarJWT,
//     validarIsAdmin,
//     toUpperCaseConvert,
//     getValidateUpdate
// ],updateMes);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveMes );


module.exports = router;