
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Ufv } = require('../database/config');
const paginate = require('../helpers/paginate');

const getUfvPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo}, id?{id}:{} 
                ],
                
            },
            include: [
                { association: 'ufv_mes',  attributes: {exclude: ['createdAt']},                     
                    
                },
                
            ],
            
        };
        let ufvs = await paginate(Ufv, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            ufvs
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newUfv = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const ufvNew = await Ufv.create(body);
        return res.status(201).json({
            ok: true,
            ufvNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateUfv = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const ufvs = await Ufv.findOne({where: {id}} );
        await ufvs.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Ufvs modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveUfv = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const ufvs = await Ufv.findByPk(id);
        await ufvs.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Ufvs activada exitosamente' : 'Ufvs inactiva exitosamente'
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
    getUfvPaginate,
    newUfv,
    updateUfv,
    activeInactiveUfv
};