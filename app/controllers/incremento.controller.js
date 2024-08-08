
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Incremento, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');

const getIncrementoPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_cargo,id, id_empleado} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_cargo? {id_cargo} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}
                ],
            },
            include: [
                { association: 'incremento_cargo',  attributes: {exclude: ['createdAt']},  
                },                 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let Incremento = await paginate(Incremento, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            Incremento
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newIncremento = async (req = request, res = response ) => {
    
    try {
        const { body } = req.body;
        const incremento = await Incremento.create(body);
        
        return res.status(201).json({
            ok: true,
            incremento
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateIncremento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const Incremento = await Incremento.findOne({where: {id}} );
        await Incremento.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Incremento modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveIncremento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const Incremento = await Incremento.findByPk(id);
        await Incremento.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Incremento se activado exitosamente' : 'Incremento se inactivo exitosamente'
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
    getIncrementoPaginate,
    newIncremento,
    updateIncremento,
    activeInactiveIncremento
};