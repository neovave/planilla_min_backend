const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getEmpleadoPaginate, getEmpleado, newEmpleado, updateEmpleado, getEmpNoAportantePaginate , migrarEmpleado/*activeInactiveEmpleado*/ } = require('../controllers/empleado.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/empledo');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getEmpleadoPaginate );

router.get('/noaportante',[
    validarJWT,
    validarIsAdmin,
],getEmpNoAportantePaginate );

router.get('/user/',[
    validarJWT,
    //validarIsAdmin,
],getEmpleado );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newEmpleado );

router.post('/migrar', [
    validarJWT,
    upload.fields([{ name: 'file', maxCount: 1 }, { name: 'file2', maxCount: 1 }]),
    validarIsAdmin,
    //toUpperCaseConvert,
    //getValidateCreate
],migrarEmpleado );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateEmpleado);

// router.put('/destroyAndActive/:id', [
//     validarJWT,
//     validarIsAdmin,
//     //validateDelete
// ],activeInactiveEmpleado );


module.exports = router;