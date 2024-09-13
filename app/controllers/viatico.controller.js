
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Viatico, sequelize} = require('../database/config');
const paginate = require('../helpers/paginate');

const getViaticoEmpPaginate = async (req = request, res = response) => {
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
                { association: 'viatico_mes',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'viatico_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let ViaticoEmp = await paginate(Viatico, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            ViaticoEmp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newViaticoEmp = async (req = request, res = response ) => {
    
    try {
        const body  = req.body;
        const ViaticoEmp = await Viatico.create(body);
        
        return res.status(201).json({
            ok: true,
            ViaticoEmp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateViaticoEmp = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const ViaticoEmp = await Viatico.findOne({where: {id}} );
        await ViaticoEmp.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Viatico modificado exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveViaticoEmp = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo, id_user_delete } = req.body;
        const ViaticoEmp = await Viatico.findByPk(id);
        await ViaticoEmp.update({activo, id_user_delete});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Viatico empleado se activado exitosamente' : 'Viatico empleado se inactivo exitosamente'
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
    getViaticoEmpPaginate,
    newViaticoEmp,
    updateViaticoEmp,
    activeInactiveViaticoEmp
};