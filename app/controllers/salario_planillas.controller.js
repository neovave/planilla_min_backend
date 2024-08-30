
const { response, request } = require('express');
const { Op, QueryTypes } = require('sequelize');
const {Salario_planilla, Asignacion_cargo_empleado ,Mes, sequelize, Users} = require('../database/config');
const paginate = require('../helpers/paginate');
const moment = require('moment');

const getSalarioPlanillaPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,filter, id_cargo,id, id_empleado, id_mes} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, id? {id} : {}, id_empleado? {id_empleado}:{}, id_mes?{id_mes}:{}
                ],
                
            },
            include: [
                // {  association: 'asistencia_empleado',  attributes: [
                //     'uuid', 
                //     [sequelize.fn('CONCAT', sequelize.col('nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'nombre_completo'],
                //     [sequelize.fn('CONCAT', sequelize.col('numero_documento'), '  ', sequelize.col('complemento')), 'numdocumento_completo'],
                
                // ],}, 
                // { association: 'asistencia_asignacioncargoemp',  attributes: [
                //     'id', 'fecha_inicio', 'fecha_limite', 'ingreso', 'retiro', 'id_reparticion', 'id_destino'
                // ],},
                // { association: 'asistencia_cargo',  attributes: ['descripcion'],}, 
                // { association: 'asistencia_mes',  attributes: ['mes_literal', 'fecha_inicio', 'fecha_limite'],}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let salariosPlanillas = await paginate(Asistencia, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            salariosPlanillas
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newSalarioPlanilla = async (req = request, res = response ) => {
    
    try {
        const  body  = req.body;
        const salariosPlanillas = await Salario_planilla.create(body);
        
        return res.status(201).json({
            ok: true,
            salariosPlanillas
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const generarSalarioPlanillaAll = async (req = request, res = response ) => {
    const t = await sequelize.transaction();
    try {
        const  body  = req.body;
        const user = await Users.findByPk(req.userAuth.id)
        const salariosPlanillasDatas = []; //await Salario_planilla.create(body);
        
        const meses = await Mes.findOne({where: { id:body.id_mes }} );
        const periodo = moment(meses.fecha_inicio).format('YYYY-MM-DD');
        
        const parametros = await sequelize.queryOne(`
            SELECT * from fun_parametros_iniciales(`+body.id_mes+`);
          `,{
            type: QueryTypes.SELECT  // Esto especifica que esperas un resultado tipo SELECT
        });
        //lista asignacion cargo
        const asignacionCargo = await Asignacion_cargo_empleado.findOne(
            {   order: [['id', 'DESC']], 
                where: { id_empleado:parametros.id_empleado, ingreso:true },
                include: [
                    { association: 'asignacioncargoemp_empleado',  attributes: {exclude: ['createdAt']},}, 
                    { association: 'asignacioncargoemp_cargo',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                    { association: 'asignacioncargoemp_reparticion',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                    { association: 'asignacioncargoemp_destino',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                ],
            });
        

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
            const existingRecord = await Salario_planilla.findOne({ where: { id_mes:body.id_mes, id_empleado:row.id_empleado, id_asig_cargo : row.id , activo:1 } });
        
            if (!existingRecord) {
              // Si no existe, realiza la inserción
              salariosPlanillasDatas.push({
                    id_mes: body.id_mes, //moment({ month: mes }).format('MMMM'),
                    id_empleado: row.id_empleado,
                    id_asig_cargo: row.id,
                    id_cargo: row.id_cargo,
                    dias_trabajados: 0,
                    dias_sancionados: 0,
                    cant_cargo: row.num_registros_empleado,
                    activo:1,
                    id_user_create: Users.id,
                });    
            }
        }
        
        const asistenciaNew = await Salario_planilla.bulkCreate(salariosPlanillasDatas, { transaction: t });
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

const updateSalarioPlanilla = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;

        //const capacitacion = await Capacitacion.findByPk(id);
        const salariosPlanillas = await Salario_planilla.findOne({where: {id}} );
        await salariosPlanillas.update(body);
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

const activeInactiveSalarioPlanilla = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const salariosPlanillas = await Salario_planilla.findByPk(id);
        await salariosPlanillas.update({activo});
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
    getSalarioPlanillaPaginate,
    newSalarioPlanilla,
    generarSalarioPlanillaAll,
    updateSalarioPlanilla,
    activeInactiveSalarioPlanilla
};