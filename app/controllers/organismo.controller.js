
const { response, request } = require('express');
const { Op } = require("sequelize");
const { Organismo } = require('../database/config');
const paginate = require('../helpers/paginate');

const getOrganismoPaginate = async (req = request, res = response) => {
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
        let Organismos = await paginate(Organismo, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            Organismos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newOrganismo = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const OrganismoNew = await Organismo.create(body);
        return res.status(201).json({
            ok: true,
            OrganismoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateOrganismo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const Organismo = await Organismo.findOne({where: {id}} );
        await Organismo.update(body);
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

const activeInactiveOrganismo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const organismos = await Organismo.findByPk(id);
        await organismos.update({activo});
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
    getOrganismoPaginate,
    newOrganismo,
    updateOrganismo,
    activeInactiveOrganismo
};