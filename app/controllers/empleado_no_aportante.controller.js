
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Empleado_no_aportante } = require('../database/config');
const paginate = require('../helpers/paginate');

const getEmpNoAportantePaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id, id_empleado, id_aporte } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo },  id? {id}:{}, id_empleado?{id_empleado}:{},         
                ],
                
            },
            include: [
                { association: 'empnoaportante_empleado',  attributes: {exclude: ['createdAt']},  
                    // where: {
                    //     [Op.and]:[
                    //         { activo } ,
                            
                    //     ]
                    // }
                },
            ],
        };
        let empNoAportantes = await paginate(Empleado_no_aportante, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            empNoAportantes
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newEmpNoAportante = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const empNoAportanteNew = await Empleado_no_aportante.create(body);
        return res.status(201).json({
            ok: true,
            empNoAportanteNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateEmpNoAportante = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const empNoAportantes = await Empleado_no_aportante.findOne({where: {id}} );
        await empNoAportantes.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Empleado no aportante fue modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveEmpNoAportante = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const empNoAportantes = await Empleado_no_aportante.findByPk(id);
        await empNoAportantes.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Empleado no aportante activada exitosamente' : 'Empleado no aportante inactiva exitosamente'
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
    getEmpNoAportantePaginate,
    newEmpNoAportante,
    updateEmpNoAportante,
    activeInactiveEmpNoAportante
};