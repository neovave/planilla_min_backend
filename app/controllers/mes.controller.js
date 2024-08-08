
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Gestion,Mes } = require('../database/config');
const paginate = require('../helpers/paginate');

const getMesPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo },                     
                ],
                
            },
            include: [
                
            ],
        };
        let meses = await paginate(Mes, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            meses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newMes = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const mesNew = await Mes.create(body);
        return res.status(201).json({
            ok: true,
            mesNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateMes = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const meses = await Mes.findOne({where: {id}} );
        await meses.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Mes modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveMes = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const meses = await Mes.findByPk(id);
        await meses.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Mes activada exitosamente' : 'Mes inactiva exitosamente'
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
    getMesPaginate,
    newMes,
    updateMes,
    activeInactiveMes
};