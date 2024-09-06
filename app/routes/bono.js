const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getTipoBonoPaginate, newTipoBono, updateTipoBono, activeInactiveTipoBono } = require('../controllers/bono.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/bono');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getTipoBonoPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newTipoBono );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateTipoBono);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveTipoBono );


module.exports = router;