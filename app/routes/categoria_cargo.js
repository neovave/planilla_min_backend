const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getCatCargoPaginate, newCatCargo, updateCatCargo, activeInactiveCatCargo } = require('../controllers/categoria_cargo.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/categoria_cargo');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getCatCargoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newCatCargo );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateCatCargo);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveCatCargo );


module.exports = router;