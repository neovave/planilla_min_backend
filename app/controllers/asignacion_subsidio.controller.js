
const { response, request } = require('express');
const { Op } = require('sequelize');
const {Asignacion_subsidio, sequelize, Tipo_descuento_sancion, Beneficiario_acreedor } = require('../database/config');
const paginate = require('../helpers/paginate');

const getAsigSubsidioPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_tipo_descuento,id, id_empleado, grupo} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            
            include: [
                { association: 'asigancionsubsidio_tipodes',  attributes: {exclude: ['createdAt']},  
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
                { association: 'asignacionsubsidio_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                // { association: 'asignaciondescuento_beneficiario',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                
            ],
            where: { 
                [Op.and]: [
                    { activo }, id_tipo_descuento? {id_tipo_descuento} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}, 
                    grupo? { '$asigancionsubsidio_tipodes.grupo$': { [Op.eq]: grupo } }:{}
                    /*type =='capacitacion_curso.codigo' ? {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    }:{},                    */
                ],
                 
            },
        };
        if(type?.includes('.')){
            type = null;
        }
        let asigDesc = await paginate(Asignacion_subsidio, page, limit, type, query, optionsDb); 
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

const newAsigSubsidio = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        let asig_subsidio = {
            id_tipo_descuento: body.id_tipo_descuento, 
            id_empleado:    body.id_empleado, 
            monto:          body.monto, 
            unidad:         body.unidad, 
            tipo_pago:      body.tipo_pago, 
            fecha_inicio:   body.fecha_inicio, 
            fecha_limite:   body.fecha_limite, 
            memo_nro:       body.memo_nro, 
            memo_detalle:   body.memo_detalle,
            estado:         body.estado, 
            activo:         body.activo };
        let id = body.id_tipo_descuento;
        const asigSubsidioNew = await Asignacion_subsidio.create(asig_subsidio, { transaction : t});
        const tdesc = await Tipo_descuento_sancion.findOne({ where: { id } });
                    
        if(tdesc.con_beneficiario){
            let benef_acre = { 
                id_asig_subsidio: asigSubsidioNew.id, 
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
            asigSubsidioNew
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

const updateAsigSubsidio = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { id, id_beneficiario  } = req.params;
        const body = req.body;

        let asig_subsidio = { 
            id_tipo_descuento: body.id_tipo_descuento, 
            id_empleado:    body.id_empleado, 
            cod_empleado:   body.cod_empleado, 
            monto:          body.monto, 
            unidad:         body.unidad, 
            tipo_pago:    body.tipo_pago, 
            fecha_inicio:   body.fecha_inicio, 
            fecha_limite:   body.fecha_limite, 
            memo_nro:       body.memo_nro, 
            memo_detalle:   body.memo_detalle,
            id_municipio:   body.id_municipio,
            estado:         body.estado, 
            activo:         body.activo };
        //let id = body.id_tipo_descuento;
        const tdesc = await Tipo_descuento_sancion.findOne({ where: { id:body.id_tipo_descuento } });

        //const capacitacion = await Capacitacion.findByPk(id);
        const asigSubsidio = await Asignacion_subsidio.findOne({where: {id}} );
        await asigSubsidio.update(asig_subsidio,  { transaction : t});

        if(tdesc.con_beneficiario){
            let benef_acre = { 
                id_asig_subsidio: id, 
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
            msg: 'Asignación subsidio modificada exitosamente'
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

const activeInactiveAsigSubsidio = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const asigSubsidio = await Asignacion_subsidio.findByPk(id);
        await asigSubsidio.update({estado});
        res.status(201).json({
            ok: true,
            msg: estado ==="AC"? 'Asignación subsidio se activado exitosamente' : 'Asignación subsidio se inactivo exitosamente'
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
    getAsigSubsidioPaginate,
    newAsigSubsidio,
    updateAsigSubsidio,
    activeInactiveAsigSubsidio
};