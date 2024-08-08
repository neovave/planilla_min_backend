
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Minimo_nacional_salario, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getMinSalarioPaginate = async (req = request, res = response) => {
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
        let minSalario = await paginate(Minimo_nacional_salario, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            minSalario
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newMinSalario = async (req = request, res = response ) => {

    try {
        const { body } = req.body;
        
        const minSalarioNew = await Minimo_nacional_salario.create(body);
        return res.status(201).json({
            ok: true,
            minSalarioNew
        });
    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const updateMinSalario = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const minSalario = await Minimo_nacional_salario.findOne({where: {id}} );
        await minSalario.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Minimo Salario modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveMinSalario = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const minSalario = await Minimo_nacional_salario.findByPk(id);
        await minSalario.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Minimo Nacional Salario activada exitosamente' : 'Minimo Nacional Salario inactiva exitosamente'
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
    getMinSalarioPaginate,
    newMinSalario,
    updateMinSalario,
    activeInactiveMinSalario
};