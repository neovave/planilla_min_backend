
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Categoria_cargo , sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getCatCargoPaginate = async (req = request, res = response) => {
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
        let catCargo = await paginate(Categoria_cargo, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            catCargo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newCatCargo = async (req = request, res = response ) => {

    try {
        const body = req.body;
        body.activo = 1;
        
        const catCargoNew = await Categoria_cargo.create(body);
        
        return res.status(201).json({
            ok: true,
            catCargoNew
        });
    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const updateCatCargo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const catCargo = await Categoria_cargo.findOne({where: {id}} );
        await catCargo.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Categoria de cargos se modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveCatCargo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo, motivo_cierre } = req.body;
        const catCargo = await Categoria_cargo.findByPk(id);
        await catCargo.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Categoria de Cargo activada exitosamente' : 'Categoria de Cargo inactiva exitosamente'
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
    getCatCargoPaginate,
    newCatCargo,
    updateCatCargo,
    activeInactiveCatCargo
};