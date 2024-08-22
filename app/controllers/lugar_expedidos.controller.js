
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Lugar_expedido } = require('../database/config');
const paginate = require('../helpers/paginate');

const getLugarExpedidoPaginate = async (req = request, res = response) => {
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
        let lugarExpedidos = await paginate(Lugar_expedido, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            lugarExpedidos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newLugarExpedido = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const lugarExpedidoNew = await Lugar_expedido.create(body);
        return res.status(201).json({
            ok: true,
            lugarExpedidoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateLugarExpedido = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const lugarExpedido = await Lugar_expedido.findOne({where: {id}} );
        await lugarExpedido.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Grado Academico modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveLugarExpedido = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const lugarExpedido = await Lugar_expedido.findByPk(id);
        await lugarExpedido.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Lugar Expedido activada exitosamente' : 'Lugar expedido inactiva exitosamente'
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
    getLugarExpedidoPaginate,
    newLugarExpedido,
    updateLugarExpedido,
    activeInactiveLugarExpedido
};