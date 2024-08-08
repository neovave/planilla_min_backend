
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Configuracion_minimo_nacional, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getConfigMinNacionalPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo }, id?{id}:{}
                ],
                
            },
            
        };
        let configminNacional = await paginate(Configuracion_minimo_nacional, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            configminNacional
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newConfigMinNacional = async (req = request, res = response ) => {

    try {
        const { body } = req.body;
        
        const configMinNacionalNew = await Configuracion_minimo_nacional.create(body);
        return res.status(201).json({
            ok: true,
            configMinNacionalNew
        });
    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const updateConfigMinNacional = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const configminNacional = await Configuracion_minimo_nacional.findOne({where: {id}} );
        await configminNacional.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Configuración Minimo Nacional Salario modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveConfigMinNacional = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const configminNacional = await Configuracion_minimo_nacional.findByPk(id);
        await configminNacional.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Configuración Minimo Nacional Salario activada exitosamente' : 'Configuración Minimo Nacional Salario inactiva exitosamente'
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
    getConfigMinNacionalPaginate,
    newConfigMinNacional,
    updateConfigMinNacional,
    activeInactiveConfigMinNacional
};