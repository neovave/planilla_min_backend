
const { response, request } = require('express');
const { Op, QueryTypes } = require('sequelize');
const {Salario_planilla, Asignacion_cargo_empleado, Asistencia, Incremento, Mes, Escala_aporte_solidario, sequelize, Users, Sequelize} = require('../database/config');
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
        let salariosPlanillasDatas = []; //await Salario_planilla.create(body);
        
        const meses = await Mes.findOne({where: { id:body.id_mes }} );
        const periodo = moment(meses.fecha_inicio).format('YYYY-MM-DD');
        //gestion activa y mes activa
        // const mesActiva = await Mes.findOne({
        //     include: [
        //         { association: 'mes_gestion',  attributes: {exclude: ['createdAt']},},
        //     ],
        //     where: { activo:1, estado:'AC', 
        //         [Op.and]:[
        //                 { '$mes_gestion.estado$': { [Op.eq]: 'AC' }, '$mes_gestion.activo$': { [Op.eq]: 1 },   } 
        //         ]
        //      },
        //     });

        const parametros = await sequelize.query(`
            SELECT * from fun_parametros_iniciales(`+body.id_mes+`);
          `,{
            type: QueryTypes.SELECT  // Esto especifica que esperas un resultado tipo SELECT
        });
        const parametro = parametros[0];
        
        //lista asistencia general
        const asistenciaEmpleado = await Asistencia.findAll(
            {   attributes: ['id_empleado', 'id_mes',
                    [sequelize.fn('sum', sequelize.col('dias_trabajados')), 'total_dias_trabajados'],
                    [sequelize.fn('sum', sequelize.col('dias_sancionados')), 'total_dias_sancionados']
                ],
                //order: [['id', 'DESC']], 
                // include: [
                //     { association: 'asistencia_salarioplanilla',  attributes: {exclude: ['createdAt']},},
                // ],
                where: { activo:1, id_mes:body.id_mes, 
                    // [Op.and]:[
                    //         { '$asistencia_salarioplanilla.id_asistencia$': { [Op.is]: null } } 
                    // ]
                 },
                group: ['id_empleado', 'id_mes']
                 
            });
        for( const fila of asistenciaEmpleado){
            //lista de asistencias por empleado
            const asistencia = await Asistencia.findAll(
            {   order: [['id', 'DESC']], 
                // include: [
                //     { association: 'asistencia_salarioplanilla',  attributes: {exclude: ['createdAt']},},
                // ],
                where: { activo:1, id_mes:body.id_mes, id_empleado:fila.id_empleado
                    // [Op.and]:[
                    //         { '$asistencia_salarioplanilla.id_asistencia$': { [Op.is]: null } } 
                    // ]
                },
            });
            // fecha de ingreso
            const asigCargoEmpleado = await Asignacion_cargo_empleado.findOne(
                {   //attributes:['fecha_inicio', 'fecha_limite'],
                    order: [['id', 'DESC']],
                    where: { activo:1, ingreso:true, id_empleado:fila.id_empleado
                    },
                });
            console.log("asignacio cargo empleado-------------------------------------:", asigCargoEmpleado);
            
            let totalGanado =0, totalHaberBasico=0, totalAntiguedad=0 ,totalDiasSancionados=0, idAsigCargo, edad;
            let asistenciaJson = [];
            for (const row of asistencia) {
                //lista asignacion cargo
                const asignacionCargo = await Asignacion_cargo_empleado.findOne(
                    {   order: [['id', 'DESC']], 
                        where: { id_empleado:row.id_empleado, id: row.id_asig_cargo, activo:1 },
                        include: [
                            { association: 'asignacioncargoemp_empleado',  attributes: {exclude: ['createdAt']},}, 
                            { association: 'asignacioncargoemp_cargo',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                            { association: 'asignacioncargoemp_reparticion',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                            { association: 'asignacioncargoemp_destino',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
                        ],
                        
                    });
                //console.log("asignacion cargo:", asignacionCargo);
                idAsigCargo = idAsigCargo? idAsigCargo: asignacionCargo.id;
                //optener el haber basico sea el correcto segun el periodo - El monto_incremnto es para planilla retroactivo
                const incrementoModel = await Incremento.findOne( {where: { id_gestion:meses.id_gestion, id_cargo: asignacionCargo.asignacioncargoemp_cargo.id }} );
                
                const {haber_basico, id_incremento, monto_incremento} = getHaberBasicoIncremento(meses, asignacionCargo, incrementoModel);
                //calcular el haber basico empleado
                
                const  {total_haber_basico,total_dias_sancionados} = calcularHaberBasico(row.dias_trabajados, row.dias_sancionados, haber_basico);
                
                //calculo de antiguedad
                const total_antiguedad = calcularAnioAntiguedad(asigCargoEmpleado.fecha_inicio,parametro.fecha_corte_antiguedad, total_haber_basico, parametro.total_salmin_anioservicio );
                
                //calculo de total ganado
                const total_ganado = totalGandoBs(total_haber_basico, total_antiguedad);
                //edad del empleado
                edad = edad? edad: edadEmpleado(asignacionCargo.asignacioncargoemp_empleado.fecha_nacimiento, parametro.fecha_corte_edad)
                totalGanado = totalGanado +  total_ganado;
                totalHaberBasico = totalHaberBasico + total_haber_basico;
                totalAntiguedad = totalAntiguedad + total_antiguedad;
                totalDiasSancionados = totalDiasSancionados + total_dias_sancionados;
                asistenciaJson.push({
                    id_asistencia: row.id, //moment({ month: mes }).format('MMMM'),
                    haber_basico: total_haber_basico,
                    total_antiguedad: total_antiguedad,
                    total_ganado: total_ganado,
                    total_dias_sancionados: total_dias_sancionados
                });
                console.log("asis:", asistenciaJson);
            }
            
            //cálculo aporte nacional silidario
            const escalaApSol = await Escala_aporte_solidario.findAll( {where: { estado:'AC', activo: 1 }} );
            const jsonAporteSol = calcularAporteSolidario(totalGanado, escalaApSol);
            console.log("json aporte solidario", jsonAporteSol);
            
            // Consulta para verificar si el id existe en la otra tabla
            //const existingRecord = await Salario_planilla.findOne({ where: { id_mes:body.id_mes, id_empleado:row.id_empleado, id_asig_cargo : row.id , activo:1 } });
        
            // Si no existe, realiza la inserción
            salariosPlanillasDatas.push({
                    id_mes: body.id_mes, //moment({ month: mes }).format('MMMM'),
                    id_empleado: fila.id_empleado,
                    id_asig_cargo: idAsigCargo,
                    asistencia: asistenciaJson,
                    edad_empleado: edad,
                    haber_basico_dia: totalHaberBasico/30,
                    antiguedad: totalAntiguedad,
                    total_ganado: totalGanado,
                    activo:1,
                    id_user_create: Users.id,
                });
            console.log("json.............:", JSON.stringify(salariosPlanillasDatas));    
        }
        //const asistenciaNew = await Salario_planilla.bulkCreate(salariosPlanillasDatas, { transaction: t });
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

function getHaberBasicoIncremento( meses, asignacionCargo, incremento ) {
    
    const numMes = moment(meses.fecha_inicio).format('MM');
    let totalHaberBasico ;
    if(incremento){
        if(numMes >=1 && numMes<=4  && incremento)
        {
            totalHaberBasico = incremento.monto_cargo_ant;
        }else{
            totalHaberBasico = incremento.monto + incremento.monto_cargo_ant;
        }
    }else{
        totalHaberBasico = asignacionCargo.asignacioncargoemp_cargo.monto;
    }
    
    return {haber_basico:totalHaberBasico, id_incremento:incremento?incremento.id:null, monto_incremento:incremento?incremento.monto:0 };
  }
function calcularHaberBasico(diasTrabajados, diasSancionados, haberBasico ) {
    let totalHaberBasico, totalDiasSancionados ;
    const totalDiasTrabajados = diasTrabajados + diasSancionados;
    let haberBasicoDia =  haberBasico/30;
    if(totalDiasTrabajados === 30){ 
        totalHaberBasico = haberBasico; //por tema de decimales o redondeo
    }else{ ///prorratear dias trabajados
        totalHaberBasico = totalDiasTrabajados * haberBasicoDia;
    }
    totalDiasSancionados = haberBasicoDia * diasSancionados;
    return {total_haber_basico:totalHaberBasico, total_dias_sancionados:totalDiasSancionados};
  }
function calcularAnioAntiguedad(fechaIngreso, fechaCorte, haberBasico, parametroAntigueda ) {
    // Convertimos la fecha de nacimiento a un objeto Moment
    const fechaIngresoMoment = moment(fechaIngreso);
    // Obtenemos la fecha actual como un objeto Moment
    const fechaActual = moment(fechaCorte);
    
    // Calculamos la diferencia en años entre ambas fechas
    const anioTrabajado = fechaActual.diff(fechaIngresoMoment, 'years');
    let totalMontoAntiguedad;
    if(anioTrabajado >= parametroAntigueda){
        totalMontoAntiguedad =  haberBasico;
    }else{
        totalMontoAntiguedad = haberBasico * ( anioTrabajado / parametroAntigueda);
    }
    
    return totalMontoAntiguedad;
}
function totalGandoBs(totalHaberBasico, totalAntiguedad) {
    let totalGanado = 0;
    if(totalHaberBasico > 0  &&  totalAntiguedad >=0 ){ 
        totalGanado = totalHaberBasico + totalAntiguedad; //por tema de decimales o redondeo
    }
    
    return totalGanado;
  }
function edadEmpleado(fechaNacimiento, fechaCorte ) {
    // Convertimos la fecha de nacimiento a un objeto Moment
    const fechaMacimientoMoment = moment(fechaNacimiento);
    // Obtenemos la fecha actual como un objeto Moment
    const fechaActual = moment(fechaCorte);
    // Calculamos la diferencia en años entre ambas fechas
    const edad = fechaActual.diff(fechaMacimientoMoment, 'years');
    
    return edad;
}
function calcularAporteSolidario(totalGanado, escalaApSol) {
    
    const escalaCumpleFiltrados = escalaApSol.filter(escala => escala.total_ganado < totalGanado);
    let aporteSolidario = []
    //console.log("escala cumplido",escalaCumpleFiltrados);
    for(const row of escalaCumpleFiltrados){
        //console.log("fila escala cumplidos:", row );
        const resultado = calculoMontoAporteNalSolidario(row.total_ganado, row.porcentaje, totalGanado);
        aporteSolidario.push({
            id_escala: row.id, //moment({ month: mes }).format('MMMM'),
            monto_bs: resultado,
            diferencia: totalGanado - row.total_ganado,
        });
    }
    
    return aporteSolidario;
}
function calculoMontoAporteNalSolidario(monto_escala, porcentaje_escala, totalGanado) {
    $resultado = 0;
    if (monto_escala > 0 && porcentaje_escala >= 0 && totalGanado > 0) {
        diferencia_bs = (totalGanado - monto_escala);
        resultado = (diferencia_bs >= 0) ? diferencia_bs * (porcentaje_escala / 100) : 0;
    }
    return resultado;
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