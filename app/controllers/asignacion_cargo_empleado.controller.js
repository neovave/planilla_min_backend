
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_cargo_empleado, Empleado, Tipo_movimiento, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getAsigCargoEmpPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_cargo,id, id_empleado, estado} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_cargo? {id_cargo} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}, estado? {estado}:{}
                ],
                
            },
            include: [
                { association: 'asignacioncargoemp_empleado',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'asignacioncargoemp_cargo',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                { association: 'asignacioncargoemp_reparticion',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                { association: 'asignacioncargoemp_destino',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let asigCargoEmp = await paginate(Asignacion_cargo_empleado, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asigCargoEmp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}


const newAsigCargoEmp = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        
        // const tipoMovDB = await Empleado.findOne({ where: {   [Op.and]:[
        //     nombre?{nombre: { [Op.eq]: 'INGRESO' }}:{} 
        // ],  } });
        body.activo = 1;
        
        //actualiza el campo tipo movimiento de la tabla empleado
        let id = body.id_empleado;
        console.log("id_empleado", body.id_empleado);
        const bodyEmp = { id_tipo_movimiento: body.id_tipo_movimiento };
        const updateEmp = await Empleado.findOne({ where: { id } });
        await updateEmp.update(bodyEmp, { transaction: t });

        //si el moviemiento es distinto de Ingreso
        const mov = await Tipo_movimiento.findOne({where: { id: body.id_tipo_movimiento } });
        console.log("timo de movimiento:", mov);
        if( mov.nombre != 'INGRESO'){
            //buscar la ultima asignacion
            const asigAnt = await Asignacion_cargo_empleado.findOne({where : {
                //[Op.and]:[ {activo: { [Op.eq]: 1, } }, {id_empleado:{[Op.eq]:body.id_empleado } } ]
                activo: 1,
                id_empleado:body.id_empleado
            },
            order: [['id', 'DESC']],
            limit: 1
            });
            
            //restar un dia a la fecha inicio
            const fecha_limite = moment(body.fecha_inicio).subtract(1, 'day');
            await asigAnt.update({estado:'CE', fecha_limite: fecha_limite}, { transaction: t });

            //console.log("ultima asig:", asigAnt);
        }
        
        //actulizar asignación
        const asigCargoEmpew = await Asignacion_cargo_empleado.create(body, { transaction : t});
        
        await t.commit();
        return res.status(201).json({
            ok: true,
            asigCargoEmpew
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAsigCargoEmp = async (req = request, res = response) => {
    
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const asigCargoEmp = await Asignacion_cargo_empleado.findOne({where: {id}} );
        await asigCargoEmp.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Asignación cargo al empleado modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateRetiroAsigCargoEmp = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const body = req.body;
        let id_empleado = body.id_empleado;


        //const capacitacion = await Capacitacion.findByPk(id);
        const asigCargoEmp = await Asignacion_cargo_empleado.findOne({where: {id}} );
        await asigCargoEmp.update(body, { transaction : t});
        
        await Asignacion_cargo_empleado.update(
            { estado: 'CE' },
            {
              where: {
                id_empleado: id_empleado,
              }, transaction: t

            },
            
          );
        await Empleado.update(
            { id_tipo_movimiento: body.id_tipo_movimiento },
            {
              where: {
                id: id_empleado,
              }, transaction: t

            },
            
          );
        await t.commit();
        return res.status(201).json({
            ok: true,
            msg: 'Asignación cargo al empleado modificada exitosamente'
        });   
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAsigCargoEmp = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const asigCargoEmp = await Asignacion_cargo_empleado.findByPk(id);
        await asigCargoEmp.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Asignación cargo al empleado se activado exitosamente' : 'Asignación cargo al empleado se inactivo exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

module.exports = {
    getAsigCargoEmpPaginate,
    newAsigCargoEmp,
    updateAsigCargoEmp,
    activeInactiveAsigCargoEmp,
    updateRetiroAsigCargoEmp
};