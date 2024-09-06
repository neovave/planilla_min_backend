
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_descuento, sequelize, Tipo_descuento_sancion, Beneficiario_acreedor } = require('../database/config');
const paginate = require('../helpers/paginate');

const getAsigDescuentoPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_tipo_descuento,id, id_empleado, grupo} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            
            include: [
                { association: 'asiganciondescuento_tipodes',  attributes: {exclude: ['createdAt']},  
                    // where: type == 'capacitacion_curso.nombre' ? {
                    //     nombre: {[Op.iLike]: `%${filter}%`}
                    // }:type =='capacitacion_curso.tipo' ? {
                    //     tipo:{[Op.iLike]: `%${filter}%`}
                    // }:{},
                    // where: {
                    //     [Op.and]:[
                    //         tipo? tipo:{},
                    //         //{tipo:{[Op.iLike]: `%${filter}%`}}
                    //     ]
                    // }
                }, 
                { association: 'asignaciondescuento_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                // { association: 'asignaciondescuento_beneficiario',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                
            ],
            where: { 
                [Op.and]: [
                    { activo }, id_tipo_descuento? {id_tipo_descuento} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}, 
                    grupo? { '$asiganciondescuento_tipodes.grupo$': { [Op.eq]: grupo } }:{}
                    /*type =='capacitacion_curso.codigo' ? {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    }:{},                    */
                ],
                 
            },
        };
        if(type?.includes('.')){
            type = null;
        }
        let asigDesc = await paginate(Asignacion_descuento, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asigDesc
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAsigDescuento = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        let asig_desc = { 
            id_tipo_descuento: body.id_tipo_descuento, 
            id_empleado:    body.id_empleado, 
            cod_empleado:   body.cod_empleado, 
            monto:          body.monto, 
            unidad:         body.unidad, 
            institucion:    body.institucion, 
            fecha_inicio:   body.fecha_inicio, 
            fecha_limite:   body.fecha_limite, 
            memo_nro:       body.memo_nro, 
            memo_detalle:   body.memo_detalle, 
            estado:         body.estado, 
            activo:         body.activo };
        let id = body.id_tipo_descuento;
        const asigDescuentoNew = await Asignacion_descuento.create(asig_desc, { transaction : t});
        const tdesc = await Tipo_descuento_sancion.findOne({ where: { id } });
                    
        if(tdesc.con_beneficiario){
            let benef_acre = { 
                id_asig_descuento: asigDescuentoNew.id, 
                detalle_ruc:    body.detalle_ruc, 
                ci_ruc:         body.ci_ruc, 
                tipo:           body.tipo, 
                descripcion:    body.descripcion, 
                activo:         body.activo };

            const benefAcreedorNew = await Beneficiario_acreedor.create(benef_acre, { transaction : t});
        }
        
        await t.commit()
        ;
        return res.status(201).json({
            ok: true,
            asigDescuentoNew
        });
    } catch (error) {
        console.log(error);
        await t.rollback()
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAsigDescuento = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { id, id_beneficiario  } = req.params;
        const body = req.body;

        let asig_desc = { 
            id_tipo_descuento: body.id_tipo_descuento, 
            id_empleado:    body.id_empleado, 
            cod_empleado:   body.cod_empleado, 
            monto:          body.monto, 
            unidad:         body.unidad, 
            institucion:    body.institucion, 
            fecha_inicio:   body.fecha_inicio, 
            fecha_limite:   body.fecha_limite, 
            memo_nro:       body.memo_nro, 
            memo_detalle:   body.memo_detalle, 
            estado:         body.estado, 
            activo:         body.activo };
        //let id = body.id_tipo_descuento;
        const tdesc = await Tipo_descuento_sancion.findOne({ where: { id:body.id_tipo_descuento } });

        //const capacitacion = await Capacitacion.findByPk(id);
        const asigDescuento = await Asignacion_descuento.findOne({where: {id}} );
        await asigDescuento.update(asig_desc,  { transaction : t});

        if(tdesc.con_beneficiario){
            let benef_acre = { 
                id_asig_descuento: id, 
                detalle_ruc:    body.detalle_ruc, 
                ci_ruc:         body.ci_ruc, 
                tipo:           body.tipo, 
                descripcion:    body.descripcion, 
                activo:         body.activo };

                console.log("beneficiario:", body );

                const asigBeneficiario = await Beneficiario_acreedor.findOne({where: {id: id_beneficiario}} );
                await asigBeneficiario.update(benef_acre,  { transaction : t});    
        }
        
        
        
        await t.commit()

        return res.status(201).json({
            ok: true,
            msg: 'Asignación descuento modificada exitosamente'
        });   
    } catch (error) {
        await t.rollback()
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAsigDescuento = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const asigDescuento = await Asignacion_descuento.findByPk(id);
        await asigDescuento.update({estado});
        res.status(201).json({
            ok: true,
            msg: estado ==="AC"? 'Asignación descuento se activado exitosamente' : 'Asignación descuento se inactivo exitosamente'
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
    getAsigDescuentoPaginate,
    newAsigDescuento,
    updateAsigDescuento,
    activeInactiveAsigDescuento
};