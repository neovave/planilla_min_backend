
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Escala_rciva_salario } = require('../database/config');
const paginate = require('../helpers/paginate');

const getEscalaRcivaPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id, } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo },  id? {id}:{},
                ],
                
            },
            // include: [
            //     { association: 'EscalaRcivaleado_empleado',  attributes: {exclude: ['createdAt']},  
                    
            //     },
            //     { association: 'EscalaRcivaleado_aporte',  attributes: {exclude: ['createdAt']},  
                    
            //     },
            // ],
        };
        let escalaRciva = await paginate(Escala_rciva_salario, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            escalaRciva
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newEscalaRciva = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const EscalaRcivaNew = await Escala_rciva_salario.create(body);
        return res.status(201).json({
            ok: true,
            EscalaRcivaNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateEscalaRciva = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const escalaRciva = await Escala_rciva_salario.findOne({where: {id}} );
        await escalaRciva.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Escala Rciva salario modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveEscalaRciva = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const escalaRciva = await Escala_rciva_salario.findByPk(id);
        await escalaRciva.update({activo});
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
    getEscalaRcivaPaginate,
    newEscalaRciva,
    updateEscalaRciva,
    activeInactiveEscalaRciva
};