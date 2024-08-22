const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getOrganismoPaginate, newOrganismo, updateOrganismo, activeInactiveOrganismo } = require('../controllers/organismo.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/organismo');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getOrganismoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newOrganismo );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateOrganismo);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveOrganismo );


module.exports = router;