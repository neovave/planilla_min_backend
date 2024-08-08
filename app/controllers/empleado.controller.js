const bcrypt = require('bcrypt');
const generarJWT = require('../helpers/jwt');
const { response, request } = require('express');
const { Empleado, Sequelize, Inscripcion } = require('../database/config');
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
        const salt = bcrypt.genSaltSync();
        body.activo = 1;
        const empleadoNew = await Empleado.create(body);
        res.status(201).json({
            ok: true,
            empleadoNew,
            token
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
        const {query, page, limit, type, activo, uuid, tipo, gestion} = req.query;
        const optionsDb = {

            attributes: ['id','uuid', 'cod_empleado', 'ci', 'nombre', 'otro_nombre', 'paterno', 'materno', 'item', 'cargo', 'unidad', 'tipo_contrato', 'activo',// [ Sequelize.fn('SUM', Sequelize.col('emplado_inscripcion.id')), 'suma_hora']
            ],
            order: [['uuid', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo}, uuid? {uuid} : {}                    
                ],
                //[Op.and]: [ {'$emplado_inscripcion.estado$':'APROBADO'}  ]
                /*[Op.or]: [
                    {
                        ci:{[Op.iLike]: `%${filter}%`}
                    },
                    {
                        nombre:{[Op.iLike]: `%${filter}%`}
                    },                    
                ],*/

            },
            
            
            include: [                
                { 
                //model: 'emplado_inscripcion',
                association: 'emplado_inscripcion',
                group:['Empleado.id','Empleado.uuid', 'Empleado.cod_empleado', 'Empleado.ci', 'Empleado.nombre', 'Empleado.otro_nombre', 'Empleado.paterno', 'Empleado.materno', 'Empleado.item', 'Empleado.cargo', 'Empleado.unidad', 'Empleado.tipo_contrato', 'Empleado.activo'],
                attributes: [  'id', 'uuid',
                    //[ db.sequelize.literal('SUM(incripcion_capacitacion.carga_horaria)'), 'horas' ],
                    //[db.sequelize.fn('SUM', db.sequelize.col('emplado_inscripcion.incripcion_capacitacion.carga_horaria')), 'suma_hora']
                    [Sequelize.fn('SUM', Sequelize.col('emplado_inscripcion.id')), 'suma_hora']
                ],   
                 /*[db.sequelize.fn('SUM', db.sequelize.col('incripcion_capacitacion.carga_horaria')), 'suma_hora'] */   
                    /*where: type =='emplado_inscripcion.estado' ? {
                        estado:{[Op.iLike]: `%${filter}%`}
                    } : type == 'inscripcion_empleado.nombre' ? {
                        nombre: {[Op.iLike]: `%${filter}%`}
                    }:{},*/
                    // where:{
                    //     [Op.and]: [
                    //         {estado: 'APROBADO' },                                                     
                    //     ],
                    //     // [Op.and]: [ 
                    //     //     {aprobado: 'SI'}:,
                    //     // ],
                        

                    // },
                    // include: [
                    //     {  
                    //     association: 'incripcion_capacitacion',  attributes: {exclude: ['createdAt']},                        
                    //     //where: tipo? {tipo: {[Op.iLike]: `%${tipo}%`} }:{}
                    //     where:{
                    //             [Op.and]: [
                    //                 tipo? {tipo: {[Op.iLike]: `%${tipo}%`} }:{},                                                     
                    //             ],
                    //             // [Op.and]: [ 
                    //             //     gestion? {gestion}:{},
                    //             // ],
                    //             // [Op.and]: [ 
                    //             //     {gestion:'2023'},
                    //             // ],
                    //             [Op.and]: [ {'$emplado_inscripcion.estado$':'APROBADO'}  ]
                    //             // [Op.and]: [ 
                    //             //     {estado:'APROBADO'},
                    //             // ],

                    //         }
                            
                    //     },
                        
                    // ],
                                 
                }, 
                
                //{ association: 'incripcion_capacitacion', /* attributes: {exclude: ['createdAt','status','updatedAt']},*/}, 
            ],
            //group : ['Empleado.id','emplado_inscripcion.id','emplado_inscripcion.incripcion_capacitacion.id'], 
            //group:['Empleado.id','Empleado.uuid', 'Empleado.cod_empleado', 'Empleado.ci', 'Empleado.nombre', 'Empleado.otro_nombre', 'Empleado.paterno', 'Empleado.materno', 'Empleado.item', 'Empleado.cargo', 'Empleado.unidad', 'Empleado.tipo_contrato', 'Empleado.activo','Empleado.updatedAt', 'emplado_inscripcion.id', 'emplado_inscripcion->incripcion_capacitacion.id'],  
        };
        //let empleados = await paginate(Empleado, page, limit, type, query, optionsDb); 

        // const empleados = await Empleado.findAll({
        //     limit: 5,
        //     //offset: (page - 1) * 5,
        //     //order: [[fn('count', col('cupselection.selection.id')), 'DESC']],
        //     attributes: ['id','uuid', 'cod_empleado', 'ci', 'nombre', 'paterno', [db.sequelize.fn('count', db.sequelize.col('emplado_inscripcion.id')), 'veces']],
        //     raw: true,
        //     required: true,
        //     separate: true,
        //     group: ['Empleado.id','Empleado.uuid','Empleado.cod_empleado','Empleado.ci','Empleado.nombre','Empleado.otro_nombre','Empleado.paterno'],
        //     include: Inscripcion ,
        //     //[
        //     //   {
        //     //     //association: 'emplado_inscripcion',
        //     //     model: Inscripcion,
        //     //     as: 'emplado_inscripcion',
        //     //     attributes: ['id'],
                
        //     //     // include: [
        //     //     //   {
        //     //     //     model: Selection,
        //     //     //     as: 'selection',
        //     //     //     attributes: ['id', 'country'],
        //     //     //     include: [
        //     //     //       {
        //     //     //         model: File,
        //     //     //         as: 'logo',
        //     //     //         attributes: ['id', 'path', 'url'],
        //     //     //       },
        //     //     //     ],
        //     //     //   },
        //     //     // ],
        //     //   },
        //     // ],
        //   });

        const empleados = await Empleado.findAll(
            {
            attributes: ['id','uuid', 'cod_empleado', 'ci', 'nombre', 'paterno', [db.sequelize.fn('SUM', db.sequelize.col('emplado_inscripcion.incripcion_capacitacion.carga_horaria')), 'total_horas']],
            group: ['Empleado.id','Empleado.uuid','Empleado.cod_empleado','Empleado.ci','Empleado.nombre','Empleado.paterno', 'emplado_inscripcion.id', 'emplado_inscripcion->incripcion_capacitacion.id' ],
            include: { association: 'emplado_inscripcion', required: true, 
                include: {
                    association: 'incripcion_capacitacion',
                    required: true,
                }
            }
        
            });
        

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

module.exports = {    infoEmpledo, getEmpleadoPaginate, getEmpleado
    
};
