const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getCargoPaginate, newCargo, updateCargo, activeInactiveCargo } = require('../controllers/cargo.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/cargo');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getCargoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newCargo );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateCargo);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveCargo );


module.exports = router;