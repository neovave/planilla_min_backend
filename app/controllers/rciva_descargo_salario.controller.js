
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Rciva_descargo_salario, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');

const getRcivaDescargoPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_mes,id, id_empleado} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_mes? {id_mes} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}
                ],
                
            },
            include: [
                { association: 'rcivadescargosalario_mes',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'rcivadescargosalario_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let rcivaDescargo = await paginate(Rciva_descargo_salario, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            rcivaDescargo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newRcivaDescargo = async (req = request, res = response ) => {
    
    try {
        const { body } = req.body;
        const rcivaDescargo = await Rciva_descargo_salario.create(body);
        
        return res.status(201).json({
            ok: true,
            rcivaDescargo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateRcivaDescargo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const rcivaDescargo = await Rciva_descargo_salario.findOne({where: {id}} );
        await rcivaDescargo.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Descargo rciva modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveRcivaDescargo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const rcivaDescargo = await Rciva_descargo_salario.findByPk(id);
        await rcivaDescargo.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Descargo rciva se activado exitosamente' : 'Descargo rciva se inactivo exitosamente'
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
    getRcivaDescargoPaginate,
    newRcivaDescargo,
    updateRcivaDescargo,
    activeInactiveRcivaDescargo
};