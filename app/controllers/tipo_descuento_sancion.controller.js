
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Tipo_descuento_sancion } = require('../database/config');
const paginate = require('../helpers/paginate');

const getTipoDescuentoPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo}, id? {id} : {}                    
                ],
                
            },
            include: [
                
            ],
        };
        let tipoDescuento = await paginate(Tipo_descuento_sancion, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            tipoDescuento
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newTipoDescuento = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const tipoDescuentoNew = await Tipo_descuento_sancion.create(body);
        return res.status(201).json({
            ok: true,
            tipoDescuentoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateTipoDescuento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const tipoDescuento = await Tipo_descuento_sancion.findOne({where: {id}} );
        await tipoDescuento.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Tipo Descuento y sanciones  modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveTipoDescuento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const tipoDescuento = await Tipo_descuento_sancion.findByPk(uuid);
        await tipoDescuento.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Tipo descuento y sanción activada exitosamente' : 'Tipo descuento y sanción inactiva exitosamente'
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
    getTipoDescuentoPaginate,
    newTipoDescuento,
    updateTipoDescuento,
    activeInactiveTipoDescuento
};