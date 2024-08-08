
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Aporte_empleado } = require('../database/config');
const paginate = require('../helpers/paginate');

const getAporteEmpPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id, id_empleado, id_aporte } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo },  id? {id}:{}, id_empleado?{id_empleado}:{}, id_aporte?{id_aporte}:{}        
                ],
                
            },
            include: [
                { association: 'aporteempleado_empleado',  attributes: {exclude: ['createdAt']},  
                    // where: {
                    //     [Op.and]:[
                    //         { activo } ,
                            
                    //     ]
                    // }
                },
                { association: 'aporteempleado_aporte',  attributes: {exclude: ['createdAt']},  
                    // where: {
                    //     [Op.and]:[
                    //         { activo } ,
                            
                    //     ]
                    // }
                },
            ],
        };
        let aporteEmp = await paginate(Aporte_empleado, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            aporteEmp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAporteEmp = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const aporteEmpNew = await Aporte_empleado.create(body);
        return res.status(201).json({
            ok: true,
            aporteEmpNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAporteEmp = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const aporteEmp = await Aporte_empleado.findOne({where: {id}} );
        await aporteEmp.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Aporte empleado modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAporteEmp = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const aporteEmp = await Aporte_empleado.findByPk(id);
        await aporteEmp.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Aporte Empleado activada exitosamente' : 'Aporte Empleado inactiva exitosamente'
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
    getAporteEmpPaginate,
    newAporteEmp,
    updateAporteEmp,
    activeInactiveAporteEmp
};