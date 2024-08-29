const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getParametroInicialPaginate } = require('../controllers/parametro_inicial.controller');
//const { getValidateCreate,  } = require('../middlewares/validators/aporte');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getParametroInicialPaginate );


module.exports = router;