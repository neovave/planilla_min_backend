
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_sancion, sequelize, Tipo_descuento_sancion } = require('../database/config');
const paginate = require('../helpers/paginate');

const getAsigSancionPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_tipo_sancion,id, id_empleado} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_tipo_sancion? {id_tipo_sancion} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}
                ],
                
            },
            include: [
                { association: 'asigancionsancion_tipodessan',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'asignaciondescuento_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let asigSancion = await paginate(Asignacion_sancion, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asigSancion
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAsigSancion = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const { body } = req.body;
        const asigSancioNew = await Asignacion_sancion.create(body);
        
        await t.commit();
        return res.status(201).json({
            ok: true,
            asigSancioNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAsigSancion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const asigSancion = await Asignacion_sancion.findOne({where: {id}} );
        await asigSancion.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Asignación sanción modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAsigSancion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const asigSancion = await Asignacion_sancion.findByPk(id);
        await asigSancion.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Asignación sanción se activado exitosamente' : 'Asignación sancion se inactivo exitosamente'
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
    getAsigSancionPaginate,
    newAsigSancion,
    updateAsigSancion,
    activeInactiveAsigSancion
};