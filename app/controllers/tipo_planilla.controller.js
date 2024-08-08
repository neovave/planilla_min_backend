
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Tipo_planilla } = require('../database/config');
const paginate = require('../helpers/paginate');

const getTipoPlanillaPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, uuid} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo},                     
                ],
                
            },
            include: [
                
            ],
        };
        let tipo_planilla = await paginate(Tipo_planilla, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            tipo_planilla
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newTipoPlanilla = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const tipoPlanillaNew = await Tipo_planilla.create(body);
        return res.status(201).json({
            ok: true,
            tipoPlanillaNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateTipoPlanilla = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const tipoplanilla = await Tipo_planilla.findOne({where: {id}} );
        await tipoplanilla.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Tipo Planilla modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveTipoPlanilla = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const tipoplanilla = await Tipo_planilla.findByPk(uuid);
        await tipoplanilla.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Tipo Planilla activada exitosamente' : 'Tipo Planilla inactiva exitosamente'
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
    getTipoPlanillaPaginate,
    newTipoPlanilla,
    updateTipoPlanilla,
    activeInactiveTipoPlanilla
};