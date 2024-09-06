
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Bono } = require('../database/config');
const paginate = require('../helpers/paginate');

const getTipoBonoPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id, tipo} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo}, id? {id} : {}, tipo?tipo:{}                    
                ],
                
            },
            include: [
                
            ],
        };
        let bonos = await paginate(Bono, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            bonos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newTipoBono = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const bonoNew = await Bono.create(body);
        return res.status(201).json({
            ok: true,
            bonoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateTipoBono = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const bonos = await Bono.findOne({where: {id}} );
        await bonos.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Tipo Bono modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveTipoBono = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const bonos = await Bono.findByPk(uuid);
        await bonos.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Tipo bono activada exitosamente' : 'Tipo bono inactiva exitosamente'
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
    getTipoBonoPaginate,
    newTipoBono,
    updateTipoBono,
    activeInactiveTipoBono
};