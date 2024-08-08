const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getBenefAcreedorPaginate, newBenefAcreedor, updateBenefAcreedor, activeInactiveBenefAcreedor } = require('../controllers/beneficiario_acreedor.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/beneficiario_acreedor');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getBenefAcreedorPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newBenefAcreedor );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateBenefAcreedor);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveBenefAcreedor );


module.exports = router;