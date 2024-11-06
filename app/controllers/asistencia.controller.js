
const { response, request } = require('express');
const { Op, QueryTypes } = require('sequelize');
const {Asistencia, Mes, sequelize, Users} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getAsistenciaPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_cargo,id, id_empleado, id_mes} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id_cargo? {id_cargo} : {}, id? {id} : {}, id_empleado? {id_empleado}:{}, id_mes?{id_mes}:{}
                ],
                
            },
            include: [
                {  association: 'asistencia_empleado',  attributes: [
                    'uuid', 
                    [sequelize.fn('CONCAT', sequelize.col('nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'nombre_completo'],
                    [sequelize.fn('CONCAT', sequelize.col('numero_documento'), '  ', sequelize.col('complemento')), 'numdocumento_completo'],
                
                ],}, 
                { association: 'asistencia_asignacioncargoemp',  attributes: [
                    'id', 'fecha_inicio', 'fecha_limite', 'ingreso', 'retiro', 'id_reparticion', 'id_destino'
                ],},
                { association: 'asistencia_cargo',  attributes: ['descripcion'],}, 
                { association: 'asistencia_mes',  attributes: ['mes_literal', 'fecha_inicio', 'fecha_limite'],}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let asistencias = await paginate(Asistencia, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asistencias
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newAsistencia = async (req = request, res = response ) => {
    
    try {
        const  body  = req.body;
        const asistencias = await Asistencia.create(body);
        
        return res.status(201).json({
            ok: true,
            asistencias
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const generarAsistenciaAll = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        const user = await Users.findByPk(req.userAuth.id)
        const asistenciasDatas = []; //await Asistencia.create(body);
        
        const meses = await Mes.findOne({where: { id:body.id_mes }} );
        const periodo = moment(meses.fecha_inicio).format('YYYY-MM-DD');

        const asignacion = await sequelize.query(`
            SELECT  id, id_empleado, id_cargo, id_tipo_movimiento, id_reparticion, id_destino, fecha_inicio,
    fecha_limite, ingreso, retiro, estado, COUNT(*) OVER (PARTITION BY id_empleado) AS num_registros_empleado
        FROM 
            asignacion_cargo_empleados
        WHERE 
            activo = 1 
            AND DATE_TRUNC('month', '`+periodo+`'::DATE) BETWEEN DATE_TRUNC('month', fecha_inicio) 
            AND COALESCE(DATE_TRUNC('month', fecha_limite), DATE_TRUNC('month', '`+periodo+`'::DATE))
        ;
              `,{
                type: QueryTypes.SELECT  // Esto especifica que esperas un resultado tipo SELECT
        });

        for (const row of asignacion) {
            // Consulta para verificar si el id existe en la otra tabla
            const existingRecord = await Asistencia.findOne({ where: { id_mes:body.id_mes, id_empleado:row.id_empleado, id_asig_cargo : row.id , activo:1 } });
        
            if (!existingRecord) {
              // Si no existe, realiza la inserción
              asistenciasDatas.push({
                    id_mes: body.id_mes, //moment({ month: mes }).format('MMMM'),
                    id_empleado: row.id_empleado,
                    id_asig_cargo: row.id,
                    id_cargo: row.id_cargo,
                    dias_trabajados: 30,
                    dias_sancionados: 0,
                    cant_cargo: row.num_registros_empleado,
                    activo:1,
                    id_user_create: Users.id,
                });    
            }
        }
        
        const asistenciaNew = await Asistencia.bulkCreate(asistenciasDatas, { transaction: t });
        await t.commit();
        return res.status(201).json({
            ok: true,   
            asistenciaNew
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateAsistencia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;

        //const capacitacion = await Capacitacion.findByPk(id);
        const asistencia = await Asistencia.findOne({where: {id}} );
        await asistencia.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Asistencia modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveAsistencia = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const asistencias = await Asistencia.findByPk(id);
        await asistencias.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Asistencia se activado exitosamente' : 'Asistencia se inactivo exitosamente'
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
    getAsistenciaPaginate,
    newAsistencia,
    generarAsistenciaAll,
    updateAsistencia,
    activeInactiveAsistencia
};