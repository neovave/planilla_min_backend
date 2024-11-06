
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Rciva_planilla, Empleado, Planilla_fecha, Mes ,sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');
const xlsx = require('xlsx');

const getRcivaPlanillaPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_mes,id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_mes? {id_mes} : {}, id? {id} : {}, 
                ],
                
            },
            include: [
                { association: 'rcivaplanilla_mes',  attributes: {include: ['mes_literal']},  
                }, 
                { association: 'rcivaplanilla_minimonacsal',  attributes: {include: ['monto_bs']},}, 
                { association: 'rcivaplanilla_escalarciva',  attributes: {include: ['totalganado']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let rcivaPlanilla = await paginate(Rciva_planilla, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            rcivaPlanilla
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newRcivaPlanilla = async (req = request, res = response ) => {
    
    try {
        const { body } = req.body;
        const rcivaPlanilla = await Rciva_planilla.create(body);
        
        return res.status(201).json({
            ok: true,
            rcivaPlanilla
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateRcivaPlanilla = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const rcivaPlanilla = await Rciva_planilla.findOne({where: {id}} );
        await rcivaPlanilla.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Planilla rciva modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveRcivaPlanilla = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const rcivaPlanilla = await Rciva_planilla.findByPk(id);
        await rcivaPlanilla.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Planilla rciva se activado exitosamente' : 'Planilla rciva se inactivo exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

function formatearTexto(texto) {
    // Convertir a mayúsculas:
    const textoMayusculas = texto.toUpperCase();
  
    // Eliminar espacios en blanco al inicio y final:
    const textoSinEspacios = textoMayusculas.trim();
  
    return textoSinEspacios;
}

module.exports = {
    getRcivaPlanillaPaginate,
    newRcivaPlanilla,
    updateRcivaPlanilla,
    activeInactiveRcivaPlanilla
};