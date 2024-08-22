
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Grado_academico } = require('../database/config');
const paginate = require('../helpers/paginate');

const getGradoAcademicoPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, id} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    { activo}, id?{id}:{} 
                ],
                
            },
            include: [
                //{ association: 'ufv_mes',  attributes: {exclude: ['createdAt']},},
                
            ],
            
        };
        let gradoAcademicos = await paginate(Grado_academico, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            gradoAcademicos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newGradoAcademico = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const gradoAcademicoNew = await Grado_academico.create(body);
        return res.status(201).json({
            ok: true,
            gradoAcademicoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateGradoAcademico = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const gradoAcademico = await Grado_academico.findOne({where: {id}} );
        await gradoAcademico.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Grado Academico modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveGradoAcademico = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const gradoAca = await Grado_academico.findByPk(id);
        await gradoAca.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Grado académico activada exitosamente' : 'Grado académico inactiva exitosamente'
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
    getGradoAcademicoPaginate,
    newGradoAcademico,
    updateGradoAcademico,
    activeInactiveGradoAcademico
};