
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Reparticion } = require('../database/config');
const paginate = require('../helpers/paginate');

const getReparticionPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id, id_organismo} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                   { activo}, id?{id}:{} , id_organismo?{id_organismo}:{}
                ],
                
            },
            include: [
                { association: 'reparticion_organismo',  attributes: {exclude: ['createdAt']},},
                
            ],
            
        };
        let reparticiones = await paginate(Reparticion, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            reparticiones
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newReparticion = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const reparticionNew = await Reparticion.create(body);
        return res.status(201).json({
            ok: true,
            reparticionNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateReparticion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const reparticiones = await Reparticion.findOne({where: {id}} );
        await reparticiones.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Reparticion modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveReparticion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const reparticiones = await Reparticion.findByPk(id);
        await reparticiones.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Reparticiòn activada exitosamente' : 'Reparticiòn inactiva exitosamente'
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
    getReparticionPaginate,
    newReparticion,
    updateReparticion,
    activeInactiveReparticion
};