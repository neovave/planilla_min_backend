const bcrypt = require('bcrypt');
const generarJWT = require('../helpers/jwt');
const { response, request } = require('express');
const { Empleado, Sequelize,sequelize, Lugar_expedido, Cargo, Organismo, Reparticion, Destino, Aporte_empleado, Seguro, Seguro_empleado, Bono, Asignacion_bono, Tipo_descuento_sancion, Asignacion_descuento, Mes, Asignacion_cargo_empleado, Beneficiario_acreedor, Asignacion_subsidio } = require('../database/config');
const paginate = require('../helpers/paginate');
const { Op } = require("sequelize");
const axios = require('axios');
const db = require('../database/config');
const moment = require('moment');
const xlsx = require('xlsx');

const infoEmpledo = async ( ciemp ) => {
    // Equivalent to `axios.get('https://httpbin.org/get?answer=42')`
    const promise = await axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params: { ci: ciemp } });
    //var response = await respuesta;
    console.log(promise.data);

    // return it
    return promise.data;

    //res.data.args; // { answer: 42 }
    //console.log(resq.data);
    /*res.status(201).json({
        ok:true,
        resq
    });*/
    //return resq.data;
    // Define los parámetros que deseas enviar
    /*const params = {
        ci: ciemp,
    };
  
    // Realiza la solicitud GET con los parámetros
    const result = axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params })
    .catch(error => {
      // Manejo de errores
      //console.error(error);
      
    });
 */   
}

/*async function axiosTest(ciemp) {
    //const response = await axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params: { ci: ciemp } });
    //const data = await response.json();  
    const response = await axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params: { ci: ciemp } })
    .then(res =>  res.status === 200 ? true : false)
    .catch(err => false);
    console.log(response);
    return response;
}*/

/*function infoEmpledo(ciemp){
    const params = {
        ci: ciemp,
    };
  
  const resultado = axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params });
  
  console.log(resultado);
    return resultado;
}
*/
const newEmpleado = async (req = request, res = response ) => {
    try {
        const body = req.body;        
        
        body.activo = 1;
        const empleadoNew = await Empleado.create(body);
        res.status(201).json({
            ok: true,
            empleadoNew            
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{
                msg: `Ocurrió un imprevisto interno | hable con soporte`
            }],
        });
    }
}

const getEmpleadoPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, activo, uuid, tipo, gestion, id, primer_nombre, segundo_nombre} = req.query;
        const optionsDb = {
            attributes: [
                    'id',
                    'uuid',
                    'cod_empleado',
                    'id_expedido',
                    'id_grado_academico',
                    'id_tipo_movimiento',
                    'numero_documento',
                    'complemento',
                    'nombre',
                    'otro_nombre',
                    'paterno',
                    'materno',
                    'ap_esposo',
                    'fecha_nacimiento',
                    'nacionalidad',
                    'sexo',
                    'nua',
                    'cuenta_bancaria',
                    'tipo_documento',
                    'cod_rciva',
                    'cod_rentista',
                    'correo',
                    'telefono',
                    'celular',
                    'activo',
                    [sequelize.fn('CONCAT', sequelize.col('numero_documento'), ' - ', sequelize.col('Empleado.nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'numdocumento_nombre'],
                    [sequelize.fn('CONCAT', sequelize.col('Empleado.nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'nombre_completo'],
                    [sequelize.fn('CONCAT', sequelize.col('numero_documento'), '  ', sequelize.col('complemento')), 'numdocumento_completo'],

            ],

            order: [['id', 'ASC']],
            
            
             
            include: [
                { association: 'empleado_ci_expedido',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'empleado_gradoacademico',  attributes: {exclude: ['createdAt','status','updatedAt']}, }, 
                { association: 'empleado_tipomovimiento', 
                    where:{
                        [Op.and]:[
                            primer_nombre?{
                            [Op.or]:[
                                primer_nombre?{tipo: { [Op.eq]: primer_nombre }}:{},segundo_nombre?{tipo: { [Op.eq]: segundo_nombre }}:{}
                            ]}:{},
                        ]
                    },
                    required: false,
                    attributes: {exclude: ['createdAt','status','updatedAt']}, }, 
            ],
            where: { 
                [Op.and]:[ { activo }, uuid? {uuid} : {}, id? {id} : {},
                    primer_nombre?{
                
                    [Op.or]: [
                        primer_nombre? { '$empleado_tipomovimiento.tipo$': { [Op.eq]: primer_nombre } }:{}, segundo_nombre?{'$empleado_tipomovimiento.tipo$': { [Op.eq]: segundo_nombre }}:{},
                        primer_nombre && !segundo_nombre?{ id_tipo_movimiento: { [Op.is]: null } }:{}
                    ]}:{}
                ]

                
                
            },
        };

        
        // const optionsDb = {

        //     attributes: ['id','uuid', 'cod_empleado', 'ci', 'nombre', 'otro_nombre', 'paterno', 'materno', 'item', 'cargo', 'unidad', 'tipo_contrato', 'activo',
        //     ],
        //     order: [['uuid', 'ASC']],
        //     where: { 
        //         [Op.and]: [
        //             { activo}, uuid? {uuid} : {}                    
        //         ],
        //     },
            
        //     include: [                
        //         { 
        //         association: 'emplado_inscripcion',
        //         group:['Empleado.id','Empleado.uuid', 'Empleado.cod_empleado', 'Empleado.ci', 'Empleado.nombre', 'Empleado.otro_nombre', 'Empleado.paterno', 'Empleado.materno', 'Empleado.item', 'Empleado.cargo', 'Empleado.unidad', 'Empleado.tipo_contrato', 'Empleado.activo'],
        //         attributes: [  'id', 'uuid',
        //             [Sequelize.fn('SUM', Sequelize.col('emplado_inscripcion.id')), 'suma_hora']
        //         ],   
                                 
        //         }, 
                
                
        //     ],
            
        // };
        
        // const empleados = await Empleado.findAll(
        //     {
        //     attributes: ['id','uuid', 'cod_empleado', 'ci', 'nombre', 'paterno', [db.sequelize.fn('SUM', db.sequelize.col('emplado_inscripcion.incripcion_capacitacion.carga_horaria')), 'total_horas']],
        //     group: ['Empleado.id','Empleado.uuid','Empleado.cod_empleado','Empleado.ci','Empleado.nombre','Empleado.paterno', 'emplado_inscripcion.id', 'emplado_inscripcion->incripcion_capacitacion.id' ],
        //     include: { association: 'emplado_inscripcion', required: true, 
        //         include: {
        //             association: 'incripcion_capacitacion',
        //             required: true,
        //         }
        //     }
        
        //     });
        
        if(type?.includes('.')){
            type = null;
        }
        let empleados = await paginate(Empleado, page, limit, type, query, optionsDb); 

        return res.status(200).json({
            ok: true,
            empleados
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const getEmpNoAportantePaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, activo, uuid, tipo, gestion, id} = req.query;
        const optionsDb = {
            attributes: [
                    'id',
                    'uuid',
                    'cod_empleado',
                    'numero_documento',
                    'complemento',
                    'nombre',
                    'otro_nombre',
                    'paterno',
                    'materno',
                    'ap_esposo',
                    'fecha_nacimiento',
                    'nacionalidad',
                    'sexo',
                    'nua',
                    'cod_rciva',
                    'cod_rentista',
                    [sequelize.fn('CONCAT', sequelize.col('numero_documento'), ' - ', sequelize.col('Empleado.nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'numdocumento_nombre'],
                    [sequelize.fn('CONCAT', sequelize.col('Empleado.nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'nombre_completo'],
                    [sequelize.fn('CONCAT', sequelize.col('numero_documento'), '  ', sequelize.col('complemento')), 'numdocumento_completo'],

            ],

            order: [['id', 'ASC']],
            
            
             
            include: [
                { association: 'empleado_empnoaportante', 
                    where:{
                        [Op.or]: [
                              { id_empleado: { [Op.is]: null } },{
                                activo: '0'
                              }
                          ],
                    },
                    //required: false,
                    attributes: {exclude: ['createdAt','status','updatedAt']}, },  
            ],
            where: { 
                [Op.and]: [
                  { activo }, uuid? {uuid} : {},
                ],
            },
        };

        if(type?.includes('.')){
            type = null;
        }
        let empleados = await paginate(Empleado, page, limit, type, query, optionsDb); 

        return res.status(200).json({
            ok: true,
            empleados
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}


const getEmpleado = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, activo, uuid, tipo} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    uuid? {uuid} : {}                    
                ],
                
            },
            include: []
            
        };
        let emp = await paginate(Empleado, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            emp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const updateEmpleado = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const empleados = await Empleado.findOne({where: {id}} );
        await empleados.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Empleado modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const migrarEmpleado = async (req = request, res = response ) => {
    //const t = await sequelize.transaction();
    try {
        let {id_mes }= req.query;
        const excelBuffer = req.files['file'][0].buffer;
        await processExcel(excelBuffer, 1, id_mes);

        // body.activo = 1;
        // const empleadoNew = await Empleado.create(body);
        //wait t.commit();
        res.status(201).json({
            ok: true,
            //empleadoNew            
        });
        
    } catch (error) {
        console.log(error);
        //await t.rollback();
        return res.status(500).json({
            ok: false,
            errors: [{
                msg: `Ocurrió un imprevisto interno | hable con soporte`
            }],
        });
    }
}
function processExcel(excelBuffer, t, id_mes) {

    const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const options = {
        header: 1,
        // raw: false, 
        // dateNF: 'yyyy-mm-dd', // Specify the date format string here
        
      };
    const excelData = xlsx.utils.sheet_to_json(worksheet, options );
  
    insertExcelIntoDatabase(excelData,  id_mes);
}

async function insertExcelIntoDatabase(data, id_mes) {
    //const columns = data[0];
    //const t = await sequelize.transaction();
    try{
            
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            
            

            //datos
            let id_empleado = 0;
            let existeEmpleado = false;
            if( row[0] ){
                
                console.log("-----Fila:", i ,"------->", row);

                //verificar y registrar extencion
                let extension;
                if( typeof row[6] !== 'undefined' ){
                    extension = await Lugar_expedido.findOne({where: { codigo:row[6] }} );
                }
                //verificar y registrar empleado
                const partes = row[19].split(' ');
                const apellidoPaterno = partes[0];
                const apellidoMaterno = partes[1];
                const nombre = partes[2]?partes[2]:"";
                const otro_nombre = partes.length == 4? partes[3]: (partes.length ==5 ? partes[3] +' '+ partes[4]: '' );
                //const fechaNac = new Date(row[7]);
                const fechaBase = moment('1900-01-01');
                const fechaNac = fechaBase.add(row[7] - 2, 'days');
                //console.log("fecha de naciomiento:-------------,",fechaNac);
                const empleado = {
                    cod_empleado: Number( row[3] ),
                    numero_documento: Number( row[5] ),
                    complemento: null,
                    nombre: nombre,
                    otro_nombre: otro_nombre,
                    paterno: apellidoPaterno,
                    materno: apellidoMaterno,
                    ap_esposo: null,
                    fecha_nacimiento: fechaNac, 
                    nacionalidad: 'BOLIVIANA',
                    sexo: null,
                    nua: Number( row[8]),
                    cuenta_bancaria: Number(row[9]),
                    tipo_documento: 'ci',
                    cod_rciva: null,//DataTypes.STRING(20),
                    cod_rentista: null,
                    correo: null,
                    telefono: null,
                    celular: null,
                    id_expedido: extension?extension.id:null,
                    id_grado_academico:null,
                    id_tipo_movimiento:1,
                    id_user_create: 0,
                    activo:1
                };
                const existEmp = await Empleado.findOne({where: { numero_documento: String( row[5] ) } } );
                
                if(!existEmp){
                    const empleadoNew = await Empleado.create(empleado );
                    id_empleado = empleadoNew.id;
                    //console.log("No existe empleado.................:", existEmp);
                    
                }else{
                    //console.log("existe empleado.................:", existEmp.id);
                    id_empleado = existEmp.id;
                    existeEmpleado = true;
                }
                
                //asisgnacion de cargo empleado
                const cargo = await Cargo.findOne({where: { abreviatura: formatearTexto( row[17] ) } } );
                const meses = await Mes.findOne({where: { id:id_mes }} );
                const organismo = await Organismo.findOne({where: { nombre: formatearTexto( row[0] ) }} );
                const reparticion = await Reparticion.findOne({where: { nombre_abreviado: formatearTexto( row[1] ) }} );
                const destino = await Destino.findOne({where: { nombre_abreviado: formatearTexto( row[2] ) }} );
                const esBaja = row[16]? true:false;
                const partFecha = row[15].split('/');
                const fechaFormated = `${partFecha[2]}-${partFecha[1]}-${partFecha[0]}`;
                const fechaIng = moment(fechaFormated, 'YY-MM-DD');
                //console.log("fecha de ingreso.......................:,",fechaIng);
                const dataAsignacion = {
                    id_gestion:meses.id_gestion,
                    id_empleado:id_empleado,
                    id_cargo:cargo.id,
                    id_tipo_movimiento: 1,
                    id_organismo: organismo.id,
                    id_reparticion: reparticion.id,
                    id_destino: destino.id,
                    ci_empleado: empleado.numero_documento,
                    fecha_inicio: fechaIng.format('YYYY-MM-DD'),
                    fecha_limite: esBaja? Date(row[16]):null,
                    motivo: esBaja? 'Baja':null,
                    nro_item: Number(row[4]),
                    ingreso: true,
                    retiro: esBaja?true:null,
                    activo: 1,
                    id_user_create: 0,
                    estado: 'AC',
                };
                if(!existeEmpleado){
                    const asigCargoNew = await Asignacion_cargo_empleado.create(dataAsignacion );
                }

                //registro de aporte afp empleado 
                const aporteEmpleados = {
                    id_empleado:id_empleado,
                    id_aporte:3,
                    motivo: "",
                    id_user_create: 0,
                    activo: 1
                };
                if(!existeEmpleado){
                    const aporteEmpleadosNew = await Aporte_empleado.create(aporteEmpleados );
                    //console.log("se registro aporte afp...............:", aporteEmpleadosNew);
                }
                //registro de seguro empleado 
                if( row[14]!== '' || row[14] !== null ){
                    const seguro = await Seguro.findOne({where: { abreviado: row[14] }} );
                    const seguroEmpleado = {
                        id_empleado:id_empleado,
                        id_seguro:seguro.id,
                        motivo: "",
                        id_user_create: 0,
                        activo: 1
                    };
                    if(!existeEmpleado){
                        const seguroEmpleadosNew = await Seguro_empleado.create(seguroEmpleado );
                        //console.log("se registro seguro emp----------------:", seguroEmpleadosNew);
                    }
                }
                //registro de bonos
                
                if( typeof row[22] !== 'undefined' ){

                    //console.log("variable BONO: ",row[22])
                    const bono = await Bono.findOne({where: { nombre_abreviado: row[22].trim() }} );
                    if(bono){
                        const asigBonoEmpleado = {
                            id_bono: bono.id,
                            id_empleado:id_empleado,
                            fecha_inicio: moment('2024-08-01'),
                            fecha_limite: null,
                            estado: 'AC',
                            id_user_create: 0,
                            activo: 1
                        };
                        const asigBonoEmpNew = await Asignacion_bono.create(asigBonoEmpleado );
                        //console.log("se registro el bono***********************:",asigBonoEmpNew);
                    }
                }
                // descuentos asistencia familiar
                if( typeof row[28] !== 'undefined' ){
                    const descuentos1 = await Tipo_descuento_sancion.findOne({where: { nombre: row[28].trim() }} );
                    if(descuentos1){
                        const asigDescuentoEmpleado = {
                            id_empleado:id_empleado,
                            id_tipo_descuento:descuentos1.id,
                            cod_empleado: empleado.cod_empleado,
                            monto: Number(row[29]),
                            unidad: descuentos1.unidad,
                            institucion: null,
                            fecha_inicio: moment('2024-08-01') ,
                            fecha_limite: null,
                            memo_nro: 0,
                            memo_detalle: "",
                            estado: 'AC',
                            id_user_create: 0,
                            activo: 1
                        };
                        const asigDescuentoEmpNew = await Asignacion_descuento.create(asigDescuentoEmpleado );
                        
                    }
                }
                if( typeof row[31] !== 'undefined' ){
                    let nombre = String(row[31]); 
                    //console.log("nombre descuento +++++++++++++++++++++++++:",nombre );

                    const descuentos2 = await Tipo_descuento_sancion.findOne({where: { nombre: nombre.trim() }} );
                    if(descuentos2 && descuentos2.grupo === 'SUBSIDIO' )
                    {
                        const asigDescuentoEmpleado2 = {
                            id_empleado:id_empleado,
                            id_tipo_descuento:descuentos2.id,
                            monto: Number(row[34]),
                            unidad: descuentos2.unidad,
                            tipo_pago: null,
                            fecha_inicio: moment('2024-08-01'),
                            fecha_limite: null,
                            memo_nro: 0,
                            memo_detalle: "",
                            estado: 'AC',
                            id_user_create: 0,
                            activo: 1
                        };
                        const asigDescuentoEmpNew2 = await Asignacion_subsidio.create(asigDescuentoEmpleado2 );
                        //console.log("se registro subsidio sanciones//////////////////////:", asigDescuentoEmpNew2);
                        if( typeof row[33] !== 'undefined' ){
                            const asigDescuentoEmpleado2 = {
                                id_asig_subsidio: asigDescuentoEmpNew2.id,
                                detalle_ruc: row[33],
                                ci_ruc: row[32],
                                tipo: null,
                                descripcion: null,
                                id_user_create: 0,
                                activo: 1
                            };
                            const beneficiarioNew = await Beneficiario_acreedor.create(asigDescuentoEmpleado2 );
                           // console.log("se registro beneficiario subsidio----------------------------:", beneficiarioNew);  
                        }
                    }else if(descuentos2 && descuentos2.grupo !== 'SUBSIDIO'){
                        const asigDescuentoEmpleado2 = {
                            id_empleado:id_empleado,
                            id_tipo_descuento:descuentos2.id,
                            cod_empleado: empleado.cod_empleado,
                            monto: Number(row[34]),
                            unidad: descuentos2.unidad,
                            institucion: null,
                            fecha_inicio: moment('2024-08-01'),
                            fecha_limite: null,
                            memo_nro: 0,
                            memo_detalle: "",
                            estado: 'AC',
                            id_user_create: 0,
                            activo: 1
                        };
                        const asigDescuentoEmpNew2 = await Asignacion_descuento.create(asigDescuentoEmpleado2 );
                        //console.log("se registro descuentos sanciones//////////////////////:", asigDescuentoEmpNew2);
                        if( typeof row[33] !== 'undefined' ){
                            const asigDescuentoEmpleado2 = {
                                id_asig_descuento: asigDescuentoEmpNew2.id,
                                detalle_ruc: row[33],
                                ci_ruc: row[32],
                                tipo: null,
                                descripcion: null,
                                id_user_create: 0,
                                activo: 1
                            };
                            const beneficiarioNew = await Beneficiario_acreedor.create(asigDescuentoEmpleado2 );
                            //console.log("se registro beneficiario ----------------------------:", beneficiarioNew);  
                        }
                    }
                }
                
            }
        
        }
        
    } catch (error) {
        console.log("Error", error);
        //await t.rollback();
    }
}
function formatearTexto(texto) {
    // Convertir a mayúsculas:
    const textoMayusculas = texto.toUpperCase();
  
    // Eliminar espacios en blanco al inicio y final:
    const textoSinEspacios = textoMayusculas.trim();
  
    return textoSinEspacios;
  }


module.exports = { infoEmpledo, migrarEmpleado, getEmpleadoPaginate, getEmpleado, newEmpleado, updateEmpleado, getEmpNoAportantePaginate };
