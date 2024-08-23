
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Destino } = require('../database/config');
const paginate = require('../helpers/paginate');

const getDestinoPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id, id_organismo} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo}, id?{id}:{}, id_organismo?{id_organismo}:{}
                ],
                
            },
            include: [
                { association: 'destino_organismo',  attributes: {exclude: ['createdAt']},},
                
            ],
            
        };
        let destinos = await paginate(Destino, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            destinos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newDestino = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const destinoNew = await Destino.create(body);
        return res.status(201).json({
            ok: true,
            destinoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateDestino = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const destinos = await Destino.findOne({where: {id}} );
        await destinos.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Destino modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveDestino = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const destinos = await Destino.findByPk(id);
        await destinos.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Destino activada exitosamente' : 'Destino inactiva exitosamente'
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
    getDestinoPaginate,
    newDestino,
    updateDestino,
    activeInactiveDestino
};