const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getGestionPaginate, newGestion, updateGestion, activeInactiveGestion } = require('../controllers/gestion.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/gestion');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getGestionPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newGestion );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateGestion);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveGestion );


module.exports = router;