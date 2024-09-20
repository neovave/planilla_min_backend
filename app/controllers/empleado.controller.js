const bcrypt = require('bcrypt');
const generarJWT = require('../helpers/jwt');
const { response, request } = require('express');
const { Empleado, Sequelize,sequelize, Lugar_expedido, Cargo, Reparticion, Destino, Aporte_empleado, Seguro, Seguro_empleado } = require('../database/config');
const paginate = require('../helpers/paginate');
const { Op } = require("sequelize");
const axios = require('axios');
const db = require('../database/config');


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
                [Op.and]: [
                  { activo }, uuid? {uuid} : {}, id? {id} : {},
                ],
                [Op.and]:[
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
    const t = await sequelize.transaction();
    try {
        let {id_mes }= req.query;
        const excelBuffer = req.files['file'][0].buffer;
        await processExcel(excelBuffer, t, id_mes);

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
  
    insertExcelIntoDatabase(excelData, t, id_mes);
}

async function insertExcelIntoDatabase(data, t, id_mes) {
const columns = data[0];
    
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        //console.log("------------>", row);
        //datos
        let id_empleado = 0;
        let existeEmpleado = false;
        if(Number( row[0] )){

            
            //verificar y registrar extencion
            const extension = await Lugar_expedido.findOne({where: { codigo:row[7] }} );

            //verificar y registrar empleado
            const partes = row[11].split(' ');
            const apellidoPaterno = partes[0];
            const apellidoMaterno = partes[1];
            const nombre = partes[2]?partes[2]:"";
            const otro_nombre = partes.length() == 4? partes[3]: (partes.length() ==5 ? partes[3] +' '+ partes[4]: '' );
            const empleado = {
                cod_empleado: Number( row[4] ),
                numero_documento: Number( row[6] ),
                complemento: null,
                nombre: nombre,
                otro_nombre: otro_nombre,
                paterno: apellidoPaterno,
                materno: apellidoMaterno,
                ap_esposo: null,
                fecha_nacimiento: Date( row[8] ),
                nacionalidad: 'BOLIVIANA',
                sexo: null,
                nua: Number( row[9]),
                cuenta_bancaria: Number(row[10]),
                tipo_documento: 'ci',
                cod_rciva: null,//DataTypes.STRING(20),
                cod_rentista: null,
                correo: null,
                telefono: null,
                celular: null,
                id_expedido: extension.id,
                id_grado_academico:null,
                id_tipo_movimiento:1,
                id_user_create: 0,
            };
            const existEmp = await Empleado.findOne({where: { numero_documento:row[7] } } );
            
            if(!existEmp){
                const empleadoNew = await Empleado.create(empleado , { transaction: t });
                id_empleado = empleadoNew.id;
            }else{
                id_empleado = existEmp.id;
                existeEmpleado = true;
            }
            
            //asisgnacion de cargo empleado
            const cargo = await Cargo.findOne({where: { abreviatura:row[18] } } );
            const meses = await Mes.findOne({where: { id:id_mes }} );
            const reparticion = await Reparticion.findOne({where: { nombre: row[2] }} );
            const destino = await Destino.findOne({where: { nombre: row[3] }} );
            const esBaja = row[17]? true:false;
            const dataAsignacion = {
                id_gestion:meses.id_gestion,
                id_empleado:id_empleado,
                id_cargo:cargo.id,
                id_tipo_movimiento: 1,
                id_reparticion: reparticion.id,
                id_destino: destino.id,
                ci_empleado: empleado.numero_documento,
                fecha_inicio: Date(row[16]),
                fecha_limite: esBaja? Date(row[17]):null,
                motivo: esBaja? 'Baja':null,
                nro_item: Number(row[5]),
                ingreso: true,
                retiro: esBaja?true:null,
                activo: 1,
                id_user_create: 0,
                estado: 'AC',
            };
            if(!existeEmpleado){
                const asigCargoNew = await Asignacion_cargo_empleado.create(dataAsignacion , { transaction: t });
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
                const aporteEmpleadosNew = await Aporte_empleado.create(aporteEmpleados , { transaction: t });
            }
            //registro de seguro empleado 
            const seguro = await Seguro.findOne({where: { nombre: row[15] }} );
            const seguroEmpleado = {
                id_empleado:id_empleado,
                id_seguro:seguro.id,
                motivo: "",
                id_user_create: 0,
                activo: 1
            };
            if(!existeEmpleado){
                const seguroEmpleadosNew = await Seguro_empleado.create(seguroEmpleado , { transaction: t });
            }
            //registro de 

            const boletaDetalle = {
                id_mes: id_mes,
                entidad: Number( row[0] ),
                nombre: row[3],
                ci: row[4],
                //fecha_nacimiento: moment(row[7], 'DD/MM/YYYY', true).isValid()? moment(row[7], 'DD/MM/YYYY', true):"",
                cuenta: row[9],
                item: Number( row[10] ),
                dias_trabajo: Number( row[11] ),
                puesto: row[12],
                haber_basico: Number(row[14]), //ataBoleta[i].replace(",","")
                bono_antiguedad: Number(row[15]),
                otros_ingresos: Number(row[16]),
                total_ingresos: Number(row[17]),
                rc_iva: Number(row[18]),
                afp: Number(row[19]),
                otro_descuentos: Number(row[20]),
                total_descuento: Number(row[22]),
                liquido_pagable: Number(row[25]),
                estado: row[28],
                activo: '1',
            };
            //console.log("boleta detalle:", boletaDetalle)
            //const newBoleta = await Boletadetalle.create(boletaDetalle , { transaction: t });
        }
        //console.log("new boleta:",newBoleta)
        // const insertQuery = `INSERT INTO excel_data (${columns.join(',')}) VALUES (${row.map(value => `'${value}'`).join(',')})`;
        // console.log("---:", insertQuery);
        // db.query(insertQuery, (err, result) => {
        // if (err) {
        //     console.error('Error inserting Excel data into MySQL:', err);
        //     throw err;
        // }
        // console.log('Excel data inserted into MySQL:', result);
        // });
    }
}


module.exports = { infoEmpledo, migrarEmpleado, getEmpleadoPaginate, getEmpleado, newEmpleado, updateEmpleado, getEmpNoAportantePaginate };
