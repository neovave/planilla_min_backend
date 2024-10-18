
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Grupo_descuento } = require('../database/config');
const paginate = require('../helpers/paginate');

const getGrupoDescuentoPaginate = async (req = request, res = response) => {
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
                //{ association: 'ufv_mes',  attributes: {exclude: ['createdAt']},},
                
            ],
            
        };
        let grupoDescuentos = await paginate(Grupo_descuento, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            grupoDescuentos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newGrupoDescuento = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const grupoDescuentoNew = await Grupo_descuento.create(body);
        return res.status(201).json({
            ok: true,
            grupoDescuentoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateGrupoDescuento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const grupoDescuento = await Grupo_descuento.findOne({where: {id}} );
        await grupoDescuento.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Grupo descuento se ha modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveGrupoDescuento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const grupoDesc = await Grupo_descuento.findByPk(id);
        await grupoDesc.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Grupo descuento activada exitosamente' : 'Grupo descuento inactiva exitosamente'
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
    getGrupoDescuentoPaginate,
    newGrupoDescuento,
    updateGrupoDescuento,
    activeInactiveGrupoDescuento
};