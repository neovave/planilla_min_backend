
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Planilla_fecha, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');

const getPlanillaFechaPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_mes,id } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_mes? {id_mes} : {}, id? {id} : {}, 
                ],
                
            },
            include: [
                { association: 'planillafecha_mes',  attributes: {exclude: ['createdAt']},  
                }, 
              //  { association: 'asignacioncargoemp_cargo',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let PlanillaFecha = await paginate(Planilla_fecha, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            PlanillaFecha
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newPlanillaFecha = async (req = request, res = response ) => {
    
    try {
        const { body } = req.body;
        const planillaFecha = await Planilla_fecha.create(body);
        
        return res.status(201).json({
            ok: true,
            planillaFecha
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updatePlanillaFecha = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const planillaFecha = await Planilla_fecha.findOne({where: {id}} );
        await planillaFecha.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Planilla Fecha modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactivePlanillaFecha = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const planillaFecha = await Planilla_fecha.findByPk(id);
        await planillaFecha.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Planilla fecha se activado exitosamente' : 'Planilla fecha se inactivo exitosamente'
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
    getPlanillaFechaPaginate,
    newPlanillaFecha,
    updatePlanillaFecha,
    activeInactivePlanillaFecha
};