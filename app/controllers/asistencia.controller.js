
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asistencia, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');

const getAsistenciaPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_cargo,id, id_empleado, id_mes} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_cargo? {id_cargo} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}, id_mes?{id_mes}:{}
                ],
                
            },
            include: [
                {  association: 'asistencia_empleado',  attributes: [
                    'uuid', 
                    [sequelize.fn('CONCAT', sequelize.col('nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'nombre_completo'],
                    [sequelize.fn('CONCAT', sequelize.col('numero_documento'), '  ', sequelize.col('complemento')), 'numdocumento_completo'],
                
                ],}, 
                { association: 'asistencia_asignacioncargoemp',  attributes: [
                    'id', 'fecha_inicio', 'fecha_limite', 'ingreso', 'retiro', 'id_reparticion', 'id_destino'
                ],},
                { association: 'asistencia_cargo',  attributes: ['descripcion'],}, 
                { association: 'asistencia_mes',  attributes: ['mes_literal'],}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let asistencias = await paginate(Asistencia, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asistencias
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAsistencia = async (req = request, res = response ) => {
    
    try {
        const  body  = req.body;
        const asistencias = await Asistencia.create(body);
        
        return res.status(201).json({
            ok: true,
            asistencias
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAsistencia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const asistencia = await Asistencia.findOne({where: {id}} );
        await asistencia.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Asistencia modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAsistencia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const asistencias = await Asistencia.findByPk(id);
        await asistencias.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Asistencia se activado exitosamente' : 'Asistencia se inactivo exitosamente'
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
    getAsistenciaPaginate,
    newAsistencia,
    updateAsistencia,
    activeInactiveAsistencia
};