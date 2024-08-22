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
        const {query, page, limit, type, activo, uuid, tipo, gestion, id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, uuid? {uuid} : {}, id? {id} : {}
                ],
            },
            include: [
                { association: 'empleado_ci_expedido',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'empleado_gradoacademico',  attributes: {exclude: ['createdAt','status','updatedAt']}, }, 
            ],
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


module.exports = {    infoEmpledo, getEmpleadoPaginate, getEmpleado, newEmpleado, updateEmpleado
    
};
