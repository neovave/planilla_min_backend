
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Seguro , sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getSeguroPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, uuid} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo },                     
                ],
                
            },
            // include: [
            //     { association: 'seguro_seguroempleado',  attributes: {exclude: ['createdAt']},  
            //         where: {
            //             [Op.and]:[
            //                 { activo } ,
                            
            //             ]
            //         }
            //     },
            // ],
        };
        let seguros = await paginate(Seguro, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            seguros
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newSeguro = async (req = request, res = response ) => {

    try {
        const { body } = req.body;
        
        const seguroNew = await Seguro.create(body);
        return res.status(201).json({
            ok: true,
            seguroNew
        });
    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const updateSeguro = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const seguros = await Seguro.findOne({where: {id}} );
        await seguros.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Seguro modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveSeguro = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const seguros = await Seguro.findByPk(id);
        await seguros.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Seguro activada exitosamente' : 'Seguro inactiva exitosamente'
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
    getSeguroPaginate,
    newSeguro,
    updateSeguro,
    activeInactiveSeguro
};