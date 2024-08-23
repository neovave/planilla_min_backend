
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Tipo_movimiento } = require('../database/config');
const paginate = require('../helpers/paginate');

const getTipoMovimientoPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id, nombre} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo}, id? {id} : {}, nombre?{nombre}:{}
                ],
                
            },
            include: [
                
            ],
        };
        let tipoMovimientos = await paginate(Tipo_movimiento, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            tipoMovimientos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newTipoMovimiento = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const tipoMovimientoNew = await Tipo_movimiento.create(body);
        return res.status(201).json({
            ok: true,
            tipoMovimientoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateTipoMovimiento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const tipoMovimiento = await Tipo_movimiento.findOne({where: {id}} );
        await tipoMovimiento.update(body);
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

const activeInactiveTipoMovimiento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const tipoMovimiento = await Tipo_movimiento.findByPk(id);
        await tipoMovimiento.update({activo});
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
    getTipoMovimientoPaginate,
    newTipoMovimiento,
    updateTipoMovimiento,
    activeInactiveTipoMovimiento
};