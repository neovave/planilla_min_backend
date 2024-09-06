
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Rciva_certificacion, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');

const getRcivaCertPaginate = async (req = request, res = response) => {
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
                { association: 'rcivacertificacion_mes',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'rcivacertificacion_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let rcivaCert = await paginate(Rciva_certificacion, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            rcivaCert
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newRcivaCert = async (req = request, res = response ) => {
    
    try {
        const body  = req.body;
        const rcivaCert = await Rciva_certificacion.create(body);
        
        return res.status(201).json({
            ok: true,
            rcivaCert
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateRcivaCert = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const rcivaCert = await Rciva_certificacion.findOne({where: {id}} );
        await rcivaCert.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Certificacion rciva modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveRcivaCert = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo, id_user_delete } = req.body;
        const rcivaCert = await Rciva_certificacion.findByPk(id);
        await rcivaCert.update({activo, id_user_delete});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Certificación rciva se activado exitosamente' : 'Certificación rciva se inactivo exitosamente'
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
    getRcivaCertPaginate,
    newRcivaCert,
    updateRcivaCert,
    activeInactiveRcivaCert
};