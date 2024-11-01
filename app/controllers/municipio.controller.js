
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Municipio } = require('../database/config');
const paginate = require('../helpers/paginate');

const getMunicipioPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo}, id?{id}:{}, 
                ],
            },
            // include: [
            //     { association: 'Municipio_organismo',  attributes: {exclude: ['createdAt']},},
                
            // ],
            
        };
        let municipios = await paginate(Municipio, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            municipios
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newMunicipio = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const municipioNew = await Municipio.create(body);
        return res.status(201).json({
            ok: true,
            municipioNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateMunicipio = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const municipios = await Municipio.findOne({where: {id}} );
        await municipios.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Municipio modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveMunicipio = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const municipios = await Municipio.findByPk(id);
        await municipios.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Municipio activada exitosamente' : 'Municipio inactiva exitosamente'
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
    getMunicipioPaginate,
    newMunicipio,
    updateMunicipio,
    activeInactiveMunicipio
};