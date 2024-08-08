
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Aporte , sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getAportePaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo },  id?{id}:{}
                ],
            },
            // include: [
            //     { association: 'Aporte_Aporteempleado',  attributes: {exclude: ['createdAt']},  
            //         where: {
            //             [Op.and]:[
            //                 { activo } ,
                            
            //             ]
            //         }
            //     },
            // ],
        };
        let aportes = await paginate(Aporte, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            aportes
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAporte = async (req = request, res = response ) => {

    try {
        const { body } = req.body;
        
        const aporteNew = await Aporte.create(body);
        return res.status(201).json({
            ok: true,
            aporteNew
        });
    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const updateAporte = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const aportes = await Aporte.findOne({where: {id}} );
        await aportes.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Aporte modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAporte = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const aportes = await Aporte.findByPk(id);
        await aportes.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Aporte activada exitosamente' : 'Aporte inactiva exitosamente'
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
    getAportePaginate,
    newAporte,
    updateAporte,
    activeInactiveAporte
};