
const { response, request } = require('express');
const { Op, QueryTypes, where } = require('sequelize');
const {Salario_planilla, Asignacion_cargo_empleado, Asistencia, Incremento, Mes, Escala_aporte_solidario, sequelize, Users,Asignacion_bono, Empleado_no_aportante, Rciva_certificacion, Rciva_descargo_salario, Viatico, Rciva_planilla, Ufv, Escala_rciva_salario } = require('../database/config');
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
            //console.log("asignacio cargo empleado-------------------------------------:", asigCargoEmpleado);
            const empleadoNoAportantes = await Empleado_no_aportante.findOne(
                {   //attributes:['fecha_inicio', 'fecha_limite'],
                    order: [['id', 'DESC']],
                    where: { activo:1, id_empleado:fila.id_empleado, fecha_inicio:{ [Op.lte]: new Date( meses.fecha_limite ) }
                    },
                });

            let totalGanado =0, totalHaberBasico=0, totalAntiguedad=0, totalBono=0 ,totalDiasSancionados=0, idAsigCargo, edadEmpleado;
            let asistenciaJson = [];
            let novedad = 'V';
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
                
                const  {total_bono, total_dias_sancionados} = calcularHaberBasico(row.dias_trabajados, row.dias_sancionados, haber_basico);
                
                //calculo de antiguedad
                const total_antiguedad = calcularAnioAntiguedad(asigCargoEmpleado.fecha_inicio,parametro.fecha_corte_antiguedad, total_bono, parametro.total_salmin_anioservicio );
                
                //calculo de bonos
                const listaBonos = await Asignacion_bono.findAll( 
                    {   where: { id_empleado:row.id_empleado, estado: 'AC', fecha_inicio:{[Op.lte]: new Date (meses.fecha_limite) }  }, 
                        include:[
                            { association: 'asignacionbono_bono',  attributes: {exclude:['createdAt','status','updatedAt']}},
                            //{ association: 'asignacionbono_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}
                        ]
                    } );

                const { total_bonos, lista_json_bono } = calcularBono(haber_basico, total_antiguedad, listaBonos);

                //calculo de total ganado, 
                const total_ganado = totalGandoBs(haber_basico, total_antiguedad, total_bonos);
                //edad del empleado
                edadEmpleado = edadEmpleado? edadEmpleado: calcularEdadEmpleado(asignacionCargo.asignacioncargoemp_empleado.fecha_nacimiento, parametro.fecha_corte_edad);
                //verificar tipo novedad para rciva
                novedad = asignacionCargo.asignacioncargoemp_empleado.ingreso? "I": (asignacionCargo.asignacioncargoemp_empleado.retiro? "R": "V" ) ;
                novedad = asignacionCargo.asignacioncargoemp_empleado.ingreso && asignacionCargo.asignacioncargoemp_empleado.retiro ? "R": novedad;

                asistenciaJson.push({
                    id_asistencia: row.id, //moment({ month: mes }).format('MMMM'),
                    haber_basico: haber_basico,
                    total_bono: total_bonos,
                    total_antiguedad: total_antiguedad,
                    total_ganado: total_ganado,
                    total_dias_sancionados: total_dias_sancionados,

                });
                console.log("asistencia json:",asistenciaJson);

                totalGanado = totalGanado +  total_ganado;
                totalHaberBasico = totalHaberBasico + haber_basico;
                totalBono = totalBono + total_bonos;
                totalAntiguedad = totalAntiguedad + total_antiguedad;
                totalDiasSancionados = totalDiasSancionados + total_dias_sancionados;
                //console.log("asis:", asistenciaJson);
            }
            
            //cálculo aporte nacional silidario
            const escalaApSol = await Escala_aporte_solidario.findAll( {where: { estado:'AC', activo: 1 }} );
            const {total_aporte_solidario , aporte_sol_json} = calcularAporteSolidario( totalGanado, escalaApSol );
            
            //calculo de afps
            const listaAfpVigente = await sequelize.query(`
                SELECT cod_config_afp, nombre_afp, abreviatura_afp, porcentaje, aplica_certificacion, aplica_edad_limite, codigo_afp from aporte_afps_vigentes();
              `,{
                type: QueryTypes.SELECT  
            });
            const {total_aporte_afp , aporte_afp_json} = calcularAporteAfp( totalGanado, listaAfpVigente, parametro.cod_edad_afp, parametro.edad_afp, parametro.cod_fecha_afp_edad, edadEmpleado, empleadoNoAportantes );
            console.log("total aporte afp:", total_aporte_afp);
            
            //calculo de rciva
            
            
            const rcivaSaldoCertificado = await Rciva_certificacion.findOne( {where: { activo: 1, id_empleado:fila.id_empleado, id_mes:body.id_mes }} );
            const filaDescargo = await Rciva_descargo_salario.findOne( {where: { activo: 1, id_empleado:fila.id_empleado, id_mes:body.id_mes }} );
            const rciva_saldo_dependiente = await Rciva_planilla.findOne({
                include:[
                    //{ association: 'rcivaplanilla_salarioplanilla',  attributes: {exclude:['createdAt','status','updatedAt']}},
                    { association: 'rcivaplanilla_planillafecha',  attributes: {exclude: ['createdAt','status','updatedAt']},}
                ],
                required: false,
                where:{
                    activo:1,  id_empleado: fila.id_empleado, id_mes: parametro.id_mes_ant, novedad:{ [Op.ne]: 'D'}
                },
                

            });
            const viaticos = await Viatico.findOne( {
                attributes: [
                    [sequelize.fn('sum', sequelize.col('importe')), 'importe'],
                    
                ],
                where: { activo: 1, id_empleado:fila.id_empleado, id_mes:body.id_mes },
                
                    } );
            const escalaRciva = await Escala_rciva_salario.findOne( {where: { activo: 1 }, order: [['id', 'DESC']], } );
            
            const calculo_rciva =  calcularRciva( parametro, fila.id_empleado, body.id_mes, totalGanado, rcivaSaldoCertificado, filaDescargo, rciva_saldo_dependiente, total_aporte_solidario, total_aporte_afp, viaticos, escalaRciva );
            
            console.log("calculo_rciva", calculo_rciva);
            //agregar parametros posteriores
            calculo_rciva.novedad = novedad;
            //calculo_rciva.id_salario_planilla= 

            
            // Consulta para verificar si el id existe en la otra tabla
            //const existingRecord = await Salario_planilla.findOne({ where: { id_mes:body.id_mes, id_empleado:row.id_empleado, id_asig_cargo : row.id , activo:1 } });
        
            // Si no existe, realiza la inserción
            salariosPlanillasDatas.push({
                    id_mes: body.id_mes, //moment({ month: mes }).format('MMMM'),
                    id_empleado: fila.id_empleado,
                    id_asig_cargo: idAsigCargo,
                    asistencia: asistenciaJson,
                    edad_empleado: edadEmpleado,
                    haber_basico_dia: totalHaberBasico/30,
                    antiguedad: totalAntiguedad,
                    total_ganado: totalGanado,
                    aporte_solidario: aporte_sol_json,
                    total_ap_solidario: total_aporte_solidario,
                    aporte_laboral_afp: aporte_afp_json,
                    total_afp: total_aporte_afp,
                    

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
    return {total_bono:totalHaberBasico, total_dias_sancionados:totalDiasSancionados};
  }
function calcularAnioAntiguedad(fechaIngreso, fechaCorte, haberBasico, parametroAntigueda ) {
    const fechaIngresoMoment = moment(fechaIngreso);
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
function totalGandoBs(totalHaberBasico, totalAntiguedad, totalBono) {
    let totalGanado = 0;
    if(totalHaberBasico > 0  &&  totalAntiguedad >=0 && totalBono >= 0 && totalBono && totalAntiguedad && totalHaberBasico){ 
        totalGanado = parseFloat(totalHaberBasico) + parseFloat(totalAntiguedad) + parseFloat(totalBono); //por tema de decimales o redondeo
        
    }
    console.log("total haber basico:", totalHaberBasico, "total antiguedad:", totalAntiguedad, "total bono:", totalBono, "total ganado:", totalGanado);
    
    return totalGanado;
  }
function calcularEdadEmpleado(fechaNacimiento, fechaCorte ) {
    // Convertimos la fecha de nacimiento a un objeto Moment
    const fechaNacimientoMoment = moment(fechaNacimiento);
    // Obtenemos la fecha actual como un objeto Moment
    const fechaActual = moment(fechaCorte);
    // Calculamos la diferencia en años entre ambas fechas
    const edad = fechaActual.diff(fechaNacimientoMoment, 'years');
    
    return edad;
}
function calcularAporteSolidario(totalGanado, escalaApSol) {
    let totalAporteSolidario = 0;
    const escalaCumpleFiltrados = escalaApSol.filter(escala => escala.total_ganado < totalGanado);
    let aporteSolidario = [];
    //console.log("escala cumplido",escalaCumpleFiltrados);
    for(const row of escalaCumpleFiltrados){
        //console.log("fila escala cumplidos:", row );
        const resultado = calculoMontoAporteNalSolidario(row.total_ganado, row.porcentaje, totalGanado);
        aporteSolidario.push({
            id_escala: row.id, //moment({ month: mes }).format('MMMM'),
            monto_bs: resultado,
            diferencia: totalGanado - row.total_ganado,
            porcentaje: row.porcentaje,
        });
        totalAporteSolidario = totalAporteSolidario + resultado;
    }
    
    return {total_aporte_solidario: totalAporteSolidario , aporte_sol_json: aporteSolidario};
}
function calculoMontoAporteNalSolidario(monto_escala, porcentaje_escala, totalGanado) {
    let resultado = 0;
    if (monto_escala > 0 && porcentaje_escala >= 0 && totalGanado > 0) {
        diferencia_bs = parseFloat(totalGanado) - parseFloat(monto_escala);
        resultado = (diferencia_bs >= 0) ? diferencia_bs * (porcentaje_escala / 100) : 0;
    }
    return resultado;
}

function calcularBono( haberBasico, antiguedad, listaBonos ) {
    let totalBono = 0;
    let bonosPerYEve = [];
    console.log("lista bonos:", listaBonos);
    for(const row of listaBonos){
        //console.log("fila escala cumplidos:", row );
        const resultado = montoPorcentajeBono(haberBasico, antiguedad, row.asignacionbono_bono.porcentaje);
        bonosPerYEve.push({
            id_asig_bono: row.id,
            id_bono: row.id_bono, //moment({ month: mes }).format('MMMM'),
            monto_bs: resultado,
            suma: haberBasico + antiguedad,
            porcentaje: row.asignacionbono_bono,
        });
        console.log("Total bonos:", bonosPerYEve);
        totalBono = parseFloat(totalBono) + parseFloat(resultado);
    }
    
    return {total_bonos: totalBono, lista_json_bono:bonosPerYEve};
}

function montoPorcentajeBono(haberBasico, antiguedad, porcentaje_escala) {
    let resultado = 0;
    console.log("cal bono, haber basico:", haberBasico, "antiguedad:",antiguedad, "porcentaje:",porcentaje_escala);
    if (haberBasico > 0 && porcentaje_escala >= 0 && antiguedad >= 0) {
        suma_bs = parseFloat( haberBasico)  + parseFloat(antiguedad );

        resultado = (suma_bs >= 0) ? suma_bs * (porcentaje_escala / 100) : 0;
        console.log("resultado cal bono:", resultado, "suma:", suma_bs);
    }
    
    return resultado;
}

function calcularAporteAfp( totalGanado, listaAfpVigente, cod_edad_afp, edadLimiteAfp, idFechaPlanillaAfpActiva, edad_empleado, empleadoNoAportantes){
    let totalAporte = 0;
    let aporte_afp_json = [];
    for( const row of listaAfpVigente ) {
        //cod_config_afp, nombre_afp, porcentaje, aplica_certificacion, aplica_edad_limite
        const id_config_afp = row.cod_config_afp;
        const porcentaje = row.porcentaje;
        const aplicaCertificacion = row.aplica_certificacion;
        const aplicaEdadLimite = row.aplica_edad_limite;
        
        //$existeRegistro = $this->existeRegistroAfp($id_config_afp, $id_salario_item, $id_mes);
        if ( edadLimiteAfp > 0 && idFechaPlanillaAfpActiva != null) { // si no existe registro (!$existeRegistro) se guarda
            const {calculo, id_noaportante} = calculoMontoAporteAFP(totalGanado, porcentaje, aplicaCertificacion, aplicaEdadLimite, edadLimiteAfp, edad_empleado, empleadoNoAportantes);
            totalAporte = totalAporte + calculo ;

            aporte_afp_json.push({
                id_config_afp: id_config_afp,
                porcentaje: porcentaje,
                monto_afp: calculo,
                id_no_aportante: id_noaportante,
                id_edad_afp: cod_edad_afp,
                id_planilla_fecha: idFechaPlanillaAfpActiva,
            });
        }
    }
    console.log("afp:", aporte_afp_json );
    return {total_aporte_afp: totalAporte, aporte_afp_json: aporte_afp_json};
}
function calculoMontoAporteAFP(totalGanado, porcentaje, certificado, aplicaEdadAFP, edadLimiteAfp, edadEmpleado, empleadoNoAportantes) {
    let resultado = 0;
    //$periodoAplicacion = EmpleadoNoaportante::periodoAplicacionCertificacionCesacionSIP($id_empleado); // 05/2019        
    let id_noaporta;
    console.log("total ganado:", totalGanado, "porcentaje:", porcentaje, "certificado:", certificado, "aplica Edad Afp:", aplicaEdadAFP, "edad Limite afp:", edadLimiteAfp, "edad empleado:", edadEmpleado, "empleados no aportantes:", empleadoNoAportantes);
    // 1.- cesacion de aportes cuando este true solo la certificacion
    if (certificado && !aplicaEdadAFP) {
        if (empleadoNoAportantes ) {
                resultado = 0;
                id_noaporta = empleadoNoAportantes.id;
        } else {
            resultado = totalGanado * (porcentaje / 100);
        }
    }

    // 2.- certificado y aplica edad afp en FALSE
    if (!certificado && !aplicaEdadAFP) {
        resultado = totalGanado * (porcentaje / 100);
    }

    // 3.- SOLO SI ES TRUE APLICA_EDAD Y CERTIFICADO ES FALSE
    // aplicar aportes segun edad del empleado
    // cumplidos los los 65 años hasta la fecha de corte no aporta a sip
    if (aplicaEdadAFP && !certificado) {
        if (edadEmpleado < edadLimiteAfp) {
            resultado = totalGanado * (porcentaje / 100);
        }
    }
    return { calculo:resultado, id_noaportante:id_noaporta };
}

function calcularRciva( parametro, idEmpleado, id_mes, totalGanado, rcivaSaldoCertificado, filaDescargo, rcivaSaldoDependiente, totalAporteNacionalSolidario, totalAFPS, viaticos, escalaRciva ){
    const porcentajeRciva = 13;
    const totalGanadoActivo = 0.1;
    const numSalMinRciva = parametro.total_salmin_rciva;
    const idNumSalMinRciva = parametro.id_rciva_obligatorio;
    const minNacionalActivo = parametro.salario_minimo;
    const idMinNacionalActivo = parametro.cod_salario_minimo;
    const totalSMN = numSalMinRciva * minNacionalActivo;
    let totalSMNPorcentaje = Math.round(totalSMN * (porcentajeRciva / 100));
    const fechaPlanillaRcivaActual = new Date(parametro.fecha_rciva_act);
    const idFechaPlanillaRcivaActual = parametro.id_fecha_rcivaact;
    const fechaPlanillaRcivaAnt = new Date(parametro.fecha_rciva_ant);
    const idFechaPlanillaRcivaAnt = parametro.id_fecha_rcivaant;
    const idMesAnterior = parametro.id_mes_anterior;
    const totalViaticos = viaticos.importe? parceFloat( viaticos.importe ):0;
    if(rcivaSaldoDependiente || typeof filaDescargo.monto_rc_iva !== 'undefined' || (rcivaSaldoCertificado ) || (totalGanado >= totalGanadoActivo)){            
            // codificacion RCIVA
            //$idCodigoRCIVA = RcivaCodificacio::getIdCodificacionRCIVA($idEmpleado);
            
            let afps_total = totalAFPS + totalAporteNacionalSolidario;
            //viaticos
            //$montoIngresoNeto = $totalGanado - $afps_total;
            //$afps_total = round( $totalGanado * (EscalaAfp::sumEscalaAfps()/100),2); //$total * 0.1271
            let montoIngresoNeto = parseFloat(totalGanado) - parseFloat( afps_total ) + totalViaticos ;
            montoIngresoNeto = Math.round((montoIngresoNeto + Number.EPSILON) * 100) / 100; //redondeo a dos decimales
            
            let baseImponible = totalSMN > montoIngresoNeto ? 0 : (montoIngresoNeto - totalSMN);
            let impuestoRCIVA = (baseImponible * (porcentajeRciva / 100));
            impuestoRCIVA = Math.round((impuestoRCIVA + Number.EPSILON) * 100) / 100; //redondeo a dos decimales
            //05-12-2021
            totalSMNPorcentaje = baseImponible==0? 0: totalSMNPorcentaje;

            let impuestoNetoRCIVA = totalSMNPorcentaje > impuestoRCIVA ? 0 : (impuestoRCIVA - totalSMNPorcentaje);
            // descargo FORM-110 (id - monto)            
            let porcentajeForm110 = typeof filaDescargo.monto_rc_iva !== 'undefined' ? filaDescargo.monto_rc_iva : 0;
            let idDescargoRCIVA = typeof filaDescargo.monto_rc_iva !== 'undefined' ? filaDescargo.cod_descargo_rciva : null;
            let saldoFavorFisco = impuestoNetoRCIVA > porcentajeForm110 ? impuestoNetoRCIVA - porcentajeForm110 : 0;
            let saldoFavorDependiente = porcentajeForm110 > impuestoNetoRCIVA ? porcentajeForm110 - impuestoNetoRCIVA : 0;

            // certificado solo para el caso de que el empleado sea nuevo            
            let idCertificadoSaldoRCIVA = (rcivaSaldoCertificado )? rcivaSaldoCertificado.id:null;
            let codigoSaldo = (rcivaSaldoCertificado )?  rcivaSaldoCertificado.impuesto_numero:null;
            let montoSaldo = (rcivaSaldoCertificado )?  rcivaSaldoCertificado.impuesto_saldo:null;
            let fechaSaldo = (rcivaSaldoCertificado )?  rcivaSaldoCertificado.impuesto_fecha_saldo:null;
            let ufvActual;
            let idUfvActual;
            valorUfv(fechaPlanillaRcivaActual)
            .then(resultado => {
                ufvActual = resultado.valor;
                idUfvActual = resultado.id;
                //console.log('Resultado del cálculo RC-IVA:', resultado);
            })
            .catch(error => {
                console.error('Error en el proceso:', error);
            });

            let listaSaldoMantenimiento = actualizacionCertificadoRciva(id_mes, idEmpleado, ufvActual, montoSaldo, fechaSaldo );
            
            let existeObservacion = listaSaldoMantenimiento.observado;                       
            // saldo del periodo anterior del empleado  --- saldo, fecha_saldo, mantenimiento,actualizado
            let filaSaldoRCIVA = saldoRcIvaMesAnteriorConActualizacionOneItem( ufvActual, idUfvActual,idMesAnterior, rcivaSaldoDependiente);
            let saldoPeriodoAnterior = filaSaldoRCIVA.saldo;
            let valorMantenimiento = filaSaldoRCIVA.mantenimiento;
            let saldoActualizado = filaSaldoRCIVA.actualizado;
            //sino tiene observacion el saldo se suma y se guarda            
            if(!existeObservacion){
                saldoPeriodoAnterior += listaSaldoMantenimiento.saldo;
                valorMantenimiento += listaSaldoMantenimiento.mantenimiento;
                saldoActualizado += listaSaldoMantenimiento.saldoactualizado;
            }
            // saldo utilizado
            let saldoUtilizado = saldoActualizado <= saldoFavorFisco ? saldoActualizado : saldoFavorFisco;
            let impuestoRCIVARetenido = saldoFavorFisco > saldoUtilizado ? (saldoFavorFisco - saldoUtilizado) : 0;
            let saldoCreditoFiscalDependiente = saldoFavorDependiente + saldoActualizado - saldoUtilizado;
            console.log("parametros:", parametro);
            console.log("descargo", filaDescargo);
            console.log("certificacion:", rcivaSaldoCertificado);
        return !existeObservacion? {
                id_mes : id_mes,
                id_minimo_nacional : idMinNacionalActivo,
                id_escala_rciva : escalaRciva.id,
                //id_salario_planilla : null,
                id_rciva_certificado : idCertificadoSaldoRCIVA,
                id_rciva_planilla_fecha : idFechaPlanillaRcivaActual,
                //novedad : ,
                ingreso_neto_bs : montoIngresoNeto,
                minimo_imponible : totalSMN,
                importe_sujeto_impuesto : baseImponible,
                impuesto_rciva : impuestoRCIVA,
                monto_porcentaje_smn : totalSMNPorcentaje,
                impuesto_neto : impuestoNetoRCIVA,
                saldo_favor_fisco : saldoFavorFisco,
                saldo_favor_dependiente : saldoFavorDependiente,
                total_salado_mes_anterior : saldoPeriodoAnterior,
                monto_saldo_actualizacion : valorMantenimiento,
                total_actualizacion : saldoActualizado,
                saldo_utilizado : saldoUtilizado,
                rciva_retenido : impuestoRCIVARetenido,
                saldo_rciva_dependiente : saldoCreditoFiscalDependiente,
                total_viaticos : totalViaticos,
                activo : 1,   
                id_rciva_descargo : idDescargoRCIVA,
            }:'';
            
    }
}
// saldo mes anterior RCIVA planilla
function saldoRcIvaMesAnteriorConActualizacionOneItem(  ufvActual, idUfvActual, idMesAnterior, filaSaldoAnterior) {
    let valorMantenimiento = 0;
    let saldoActualizado = 0;
    let saldoRciva = 0;
    let fechaSaldoRciva = null;
    let ufvAnterior;
    let idUfvAnterior;
    if (idMesAnterior > 0){
        //$saldoRciva = isset($filaSaldoAnterior['saldo_rciva_dependiente']) ? $filaSaldoAnterior['saldo_rciva_dependiente'] : 0;
        if( typeof filaSaldoAnterior.saldo_rciva_dependiente_dos !== 'undefined' ){
            saldoRciva = filaSaldoAnterior.saldo_rciva_dependiente_dos;
        }else if( typeof filaSaldoAnterior.saldo_rciva_dependiente !== 'undefined' ){
            saldoRciva = filaSaldoAnterior.saldo_rciva_dependiente;
        }else{
            saldoRciva = 0;
        }
        fechaSaldoRciva = typeof filaSaldoAnterior.fecha_rciva_planilla !== 'undefined'? filaSaldoAnterior.fecha_rciva_planilla : NULL;
        //si tyiene saldo
        if (saldoRciva > 0) {
            // ufv actual
            //ufv anterior
            
            valorUfv(fechaSaldoRciva)
            .then(resultado => {
                ufvAnterior = resultado.valor;
                idUfvAnterior = resultado.id;
                //console.log('Resultado del cálculo RC-IVA:', resultado);
            })
            .catch(error => {
                console.error('Error en el proceso:', error);
            });
            // valor del mantenimiento del saldo
            valorMantenimiento = valorMantenimientoActualizacionUFV(ufvActual, ufvAnterior, saldoRciva);
            saldoActualizado = saldoRciva + valorMantenimiento;
        }
    }
    

    let lista = {
        saldo : saldoRciva,
        fecha_saldo : fechaSaldoRciva,
        mantenimiento : valorMantenimiento,
        actualizado : saldoActualizado,
        id_ufv_actual : idUfvActual,
        id_ufv_old : idUfvAnterior
    };

    return lista;
}
function actualizacionCertificadoRciva(idMes, idEmpleado, ufvActual, montoSaldo, fecha) {
    let valorMantenimiento = 0;
    let saldoActualizado = 0;
    let saldoRciva = montoSaldo != null ? montoSaldo : 0;
    fechaSaldo = (fecha != null) ? fecha : null;
    let observado = false;
    if (idEmpleado > 0 && idMes > 0 && ufvActual > 0) {
        let ufvSaldo;
        valorUfv(fechaSaldo)
            .then(resultado => {
                ufvSaldo = resultado
                //console.log('Resultado del cálculo RC-IVA:', resultado);
            })
            .catch(error => {
                console.error('Error en el proceso:', error);
            });

        
        if (ufvSaldo == 0 && fechaSaldo != null) {
            observado = true;
        } else if(fechaSaldo != null) {
            // valor del mantenimiento del saldo
            valorMantenimiento = valorMantenimientoActualizacionUFV(ufvActual, ufvSaldo, saldoRciva);
            saldoActualizado = saldoRciva + valorMantenimiento;
        }
    }

    return {
        mantenimiento: valorMantenimiento, 
        saldoactualizado: saldoActualizado,
        observado: observado
    };
}
async function valorUfv(fechaCalculo) {
    try {
      // Realizar la consulta a la tabla ufvs con Sequelize
      const ufvData = await Ufv.findOne({
        where: { fecha: fechaCalculo }
      });
  
      if (!ufvData) {
        throw new Error('No se encontró el valor UFV para la fecha especificada.');
      }
  
      // Retorna el resultado o úsalo como quieras
      return ufvData;
  
    } catch (error) {
      console.error('Error en el cálculo RC-IVA:', error);
      throw error; // Propaga el error si lo necesitas manejar en otro lugar
    }
  }
// ufv actualizado
function valorMantenimientoActualizacionUFV(ufvactual, ufvAnterior, monto) {
    let resultado = 0;
    if (ufvactual >= 0 && ufvAnterior >= 0 && monto >= 0) {
        let ufvActualizado = (ufvactual / ufvAnterior) - 1;
        resultado = ufvActualizado * monto;
    }
    resultado = Math.round((resultado + Number.EPSILON) * 100) / 100; //redondeo a dos decimales
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