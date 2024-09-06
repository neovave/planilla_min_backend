
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_bono, sequelize, } = require('../database/config');
const paginate = require('../helpers/paginate');

const getAsigBonoPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_bono,id, id_empleado} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_bono? {id_bono} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}
                    /*type =='capacitacion_curso.codigo' ? {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    }:{},                    */
                ],
                /*[Op.or]:[
                    {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    },
                    {
                        tipo:{[Op.iLike]: `%${filter}%`}
                    }
                ],*/ 
            },
            include: [
                { association: 'asignacionbono_bono',  attributes: {exclude: ['createdAt']},  
                    /*where: type == 'capacitacion_curso.nombre' ? {
                        nombre: {[Op.iLike]: `%${filter}%`}
                    }:type =='capacitacion_curso.tipo' ? {
                        tipo:{[Op.iLike]: `%${filter}%`}
                    }:{},
                    where: {
                        [Op.or]:[
                            { nombre: {[Op.iLike]: `%${filter}%`} },
                            //{tipo:{[Op.iLike]: `%${filter}%`}}
                        ]
                    }*/
                }, 
                { association: 'asignacionbono_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let asigBono = await paginate(Asignacion_bono, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asigBono
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAsigBono = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        body.activo = 1;
        
        const asigBonoNew = await Asignacion_bono.create(body, { transaction : t});
                    
        await t.commit();
        return res.status(201).json({
            ok: true,
            asigBonoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAsigBono = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const asigBono = await Asignacion_bono.findOne({where: {id}} );
        await asigBono.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Asignación bono modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAsigBono = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const asigBono = await Asignacion_bono.findByPk(id);
        await asigBono.update({estado});
        res.status(201).json({
            ok: true,
            msg: estado ==="AC"? 'Asignación bono se activado exitosamente' : 'Asignación bono se inactivo exitosamente'
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
    getAsigBonoPaginate,
    newAsigBono,
    updateAsigBono,
    activeInactiveAsigBono
};