const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getAsigCargoEmpPaginate, newAsigCargoEmp, updateAsigCargoEmp, activeInactiveAsigCargoEmp, updateRetiroAsigCargoEmp, importarAsigCargoDestino } = require('../controllers/asignacion_cargo_empleado.controller');
const { validateDelete, getValidateUpdate, getValidateCreate, getValidateImport } = require('../middlewares/validators/asignacion_cargo_empleado');
const { filesExist } = require('../middlewares/validators/validar-files');
//const multer = require('multer');
//const storage = multer.memoryStorage();
//const path = require('path');
//const upload = multer({ storage: storage });

// Configuración de multer para subir archivos
//const upload = multer({ dest: path.join(__dirname, '../../public/upload/','temp') }); // Carpeta temporal

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin
],getAsigCargoEmpPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newAsigCargoEmp );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateAsigCargoEmp);

router.put('/retiro/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateRetiroAsigCargoEmp);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveAsigCargoEmp );

router.post('/importar_destino', [
    validarJWT,
    //upload.fields([{ name: 'file', maxCount: 1 }, { name: 'file2', maxCount: 1 }]),
    validarIsAdmin,
    toUpperCaseConvert,
    filesExist,
    getValidateImport
],importarAsigCargoDestino );


module.exports = router;