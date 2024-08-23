
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Cargo, sequelize, Categoria_cargo } = require('../database/config');
const paginate = require('../helpers/paginate');

const getCargoPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_categoria,id} = req.query;
        const optionsDb = {
            attributes:[
                    'id',
                    'id_categoria',
                    'codigo',
                    'descripcion',
                    'monto',
                    'nivel',
                    'cantidad_item',
                    'tipo',
                    'monto_mensual',
                    'codigo_escala',
                    'estado',
                    'activo',
                    [sequelize.fn('CONCAT', sequelize.col('tipo'), ' - ', sequelize.col('descripcion')), 'tipo_descripcion'],
                ],
             
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_categoria? {id_categoria} : {}, id? {id} : {}
                    /*type =='capacitacion_curso.codigo' ? {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    }:{},                    */
                ],
            },
            include: [
                { association: 'cargo_categoriacargo',  attributes: {exclude: ['createdAt']},  
                }, 
                { association: 'cargo_asignacioncargoemp',  attributes: {exclude: ['createdAt','status','updatedAt']}, }, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let cargos = await paginate(Cargo, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            cargos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newCargo = async (req = request, res = response ) => {
    
    try {
        const body  = req.body;
        body.activo = 1;
        const cargoNew = await Cargo.create(body);
        return res.status(201).json({
            ok: true,
            cargoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateCargo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const cargos = await Cargo.findOne({where: {id}} );
        await cargos.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Cargo modificado exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveCargo = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const cargos = await Cargo.findByPk(id);
        await cargos.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo? 'Cargo se activado exitosamente' : 'Cargo se inactivo exitosamente'
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
    getCargoPaginate,
    newCargo,
    updateCargo,
    activeInactiveCargo
};