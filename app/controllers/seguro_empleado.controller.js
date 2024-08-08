
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Seguro_empleado } = require('../database/config');
const paginate = require('../helpers/paginate');

const getSeguroEmpPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id, id_empleado, id_seguro } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo },  id? {id}:{}, id_empleado?{id_empleado}:{}, id_seguro?{id_seguro}:{}        
                ],
                
            },
            include: [
                { association: 'seguroempleado_empleado',  attributes: {exclude: ['createdAt']},  
                    // where: {
                    //     [Op.and]:[
                    //         { activo } ,
                            
                    //     ]
                    // }
                },
                { association: 'seguroempleado_seguro',  attributes: {exclude: ['createdAt']},  
                    // where: {
                    //     [Op.and]:[
                    //         { activo } ,
                            
                    //     ]
                    // }
                },
            ],
        };
        let seguroEmp = await paginate(Seguro_empleado, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            seguroEmp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newSeguroEmp = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const seguroEmpNew = await Seguro_empleado.create(body);
        return res.status(201).json({
            ok: true,
            seguroEmpNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateSeguroEmp = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const seguroEmp = await Seguro_empleado.findOne({where: {id}} );
        await seguroEmp.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Seguro empleado modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveSeguroEmp = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const seguroEmp = await Seguro_empleado.findByPk(id);
        await seguroEmp.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Seguro Empleado activada exitosamente' : 'Seguro Empleado inactiva exitosamente'
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
    getSeguroEmpPaginate,
    newSeguroEmp,
    updateSeguroEmp,
    activeInactiveSeguroEmp
};