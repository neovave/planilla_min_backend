
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_cargo_empleado, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');

const getAsigCargoEmpPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_cargo,id, id_empleado} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_cargo? {id_cargo} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}
                ],
                
            },
            include: [
                { association: 'asignacioncargoemp_empleado',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'asignacioncargoemp_cargo',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
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
    
    try {
        const { body } = req.body;
        const asigCargoEmpew = await Asignacion_cargo_empleado.create(body);
        
        return res.status(201).json({
            ok: true,
            asigCargoEmpew
        });
    } catch (error) {
        console.log(error);
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
    activeInactiveAsigCargoEmp
};