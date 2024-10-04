
const { response, request, raw } = require('express');
const { Op, fn, col, QueryTypes, where, literal  } = require('sequelize');
const {Salario_planilla, Asignacion_cargo_empleado, Asistencia, Incremento, Mes, Escala_aporte_solidario, sequelize, Users,Asignacion_bono, Empleado_no_aportante, Rciva_certificacion, Rciva_descargo_salario, Viatico, Rciva_planilla, Ufv, Escala_rciva_salario, Asignacion_descuento, Escala_patronal, Asignacion_subsidio } = require('../database/config');
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
                {  association: 'salarioplanilla_empleado',  attributes: [
                    'uuid', 
                    [sequelize.fn('CONCAT', sequelize.col('salarioplanilla_empleado.nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'nombre_completo'],
                    [sequelize.fn('CONCAT', sequelize.col('numero_documento'), '  ', sequelize.col('complemento')), 'numdocumento_completo'],
                
                ],}, 
                { association: 'salarioplanilla_asignacioncargoemp',  attributes: [
                    'id', 'fecha_inicio', 'fecha_limite', 'ingreso', 'retiro', 'id_reparticion', 'id_destino'],
                    include:[
                        { association: 'asignacioncargoemp_cargo' },
                    //    { association: 'asignacioncargoemp_reparticion', attributes:['nombre'] },
                    //    { association: 'asignacioncargoemp_destino', attributes:['nombre'] },
                    ],
                },

                // { association: 'asistencia_cargo',  attributes: ['descripcion'],}, 
                { association: 'salarioplanilla_mes',  attributes: ['mes_literal', 'fecha_inicio', 'fecha_limite'],}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let salariosPlanillas = await paginate(Salario_planilla, page, limit, type, query, optionsDb); 
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
        let rcivaPlanillasDatas = [];
        let listaSinRegistro = [];

        const meses = await Mes.findOne({where: { id:body.id_mes }} );
        const periodo = moment(meses.fecha_inicio).format('YYYY-MM-DD');
        //let periodo = new Date(meses.fecha_inicio).toISOString();
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
        console.log("--------------------------------------------------------------------parametro iniciales:",parametro);
        //lista asistencia general
        const asistenciaEmpleado = await Asistencia.findAll(
            {   attributes: ['id_empleado', 'id_mes',
                    //[sequelize.fn('CONCAT', sequelize.col('Empleado.nombre'), '  ', sequelize.col('paterno'), '  ', sequelize.col('materno')), 'nombre_completo'],
                    //[sequelize.fn('CONCAT', sequelize.col('numero_documento'), '  ', sequelize.col('complemento')), 'numdocumento_completo'],
                    [sequelize.fn('sum', sequelize.col('dias_trabajados')), 'total_dias_trabajados'],
                    [sequelize.fn('sum', sequelize.col('dias_sancionados')), 'total_dias_sancionados'],
                    [sequelize.fn('CONCAT', sequelize.col('asistencia_empleado.nombre'), '  ', sequelize.col('asistencia_empleado.paterno'), '  ', sequelize.col('asistencia_empleado.materno')), 'nombre_completo'],
                    [sequelize.fn('CONCAT', sequelize.col('asistencia_empleado.numero_documento'), '  ', sequelize.col('asistencia_empleado.complemento')), 'numdocumento_completo']
                ],
                //order: [['id', 'DESC']], 
                include: [
                    { association: 'asistencia_empleado',  attributes: [],
                    },
                ],
                where: { activo:1, id_mes:body.id_mes, 
                    // [Op.and]:[
                    //         { '$asistencia_salarioplanilla.id_asistencia$': { [Op.is]: null } } 
                    // ]
                 },
                group: ['id_empleado', 'id_mes', 'nombre','paterno', 'materno', 'numero_documento', 'complemento'],
                
                raw: true
            });
            
        const escalaApSol = await Escala_aporte_solidario.findAll( {where: { estado:'AC', activo: 1 }} );
        const listaAfpVigente = await sequelize.query(`
                SELECT cod_config_afp, nombre_afp, abreviatura_afp, porcentaje, aplica_certificacion, aplica_edad_limite, codigo_afp from aporte_afps_vigentes();
              `,{
                type: QueryTypes.SELECT  
            });
        const listaPatronalVigente = await Escala_patronal.findAll( {
                order: [['id', 'DESC']], 
                attributes: [
                    'id', 
                    'porcentaje', 
                    'nombre',
                    'descripcion', 
                    'aplica_certificacion_afp', 
                    'aplica_edad_limite', 
                    'apat_codigo'
                ],
                where: { activo: 1 }
                } );
            

        for( const fila of asistenciaEmpleado){

            //verificar si existe registro
            const existeSalarioPlanilla = await Salario_planilla.findOne({ where: { activo:1, id_mes:body.id_mes, id_empleado:fila.id_empleado } });
            if(!existeSalarioPlanilla){
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
                        where: { activo:1, id_empleado:fila.id_empleado, 
                            fecha_inicio:{ [Op.lte]: new Date( meses.fecha_limite ) }
                        },
                    });

                let totalGanado =0, totalHaberBasico=0, totalAntiguedad=0, totalBono=0, totalDiasTrabajados=0, totalDiasSancionados =0, montoTotalDiasSancionados=0, idAsigCargo, edadEmpleado=0;
                let asistenciaJson = [], bonosJson =[];
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
                    
                    const  {total_haber_basico, monto_total_dias_sancionados} = calcularHaberBasico(row.dias_trabajados, row.dias_sancionados, haber_basico);
                    
                    //calculo de antiguedad
                    const total_antiguedad = calcularAnioAntiguedad(asigCargoEmpleado.fecha_inicio,parametro.fecha_corte_antiguedad, total_haber_basico, parametro.total_salmin_anioservicio );
                    
                    //calculo de bonos
                    
                    const listaAsigBonos = await Asignacion_bono.findAll( 
                        {   where: { id_empleado:row.id_empleado, estado: 'AC', //fecha_inicio:{[Op.lte]: new Date (meses.fecha_limite) }  
                            [Op.and]: [
                                literal(`DATE_TRUNC('month', '`+periodo+`'::DATE ) BETWEEN DATE_TRUNC('month', fecha_inicio) AND COALESCE(DATE_TRUNC('month', fecha_limite), DATE_TRUNC('month', '`+periodo+`'::DATE))` )
                            ]
                            
                                }, 
                            include:[
                                { association: 'asignacionbono_bono',  attributes: {exclude:['createdAt','status','updatedAt']}},
                                //{ association: 'asignacionbono_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}
                            ]
                        } );
                    const { total_bonos, lista_json_bono } = calcularBono(total_haber_basico, total_antiguedad, listaAsigBonos, row.id_cargo );
                    

                    //calculo de total ganado, 
                    const total_ganado = totalGandoBs(total_haber_basico, total_antiguedad, total_bonos);
                    //edad del empleado
                    edadEmpleado = edadEmpleado? edadEmpleado: calcularEdadEmpleado(asignacionCargo.asignacioncargoemp_empleado.fecha_nacimiento, parametro.fecha_corte_edad);

                    //console.log("edad del empleado????????????????:", edadEmpleado);
                    
                    //verificar tipo novedad para rciva
                    novedad = asignacionCargo.asignacioncargoemp_empleado.ingreso? "I": (asignacionCargo.asignacioncargoemp_empleado.retiro? "D": "V" ) ;
                    novedad = asignacionCargo.asignacioncargoemp_empleado.ingreso && asignacionCargo.asignacioncargoemp_empleado.retiro ? "D": novedad;

                    asistenciaJson.push({
                        id_asistencia: row.id, //moment({ month: mes }).format('MMMM'),
                        haber_basico: total_haber_basico,
                        total_bono: total_bonos,
                        total_antiguedad: total_antiguedad,
                        total_ganado: total_ganado,
                        monto_total_dias_sancionados: monto_total_dias_sancionados,
                        dias_trabajados: row.dias_trabajados,

                    });
                    bonosJson.push({
                        total_bono: total_bonos,
                        bonos: lista_json_bono,
                    });
                    //console.log("asistencia json:",asistenciaJson);
                    console.log("total ganado");
                    totalGanado = totalGanado +  total_ganado;
                    totalHaberBasico = totalHaberBasico + total_haber_basico;
                    totalBono = totalBono + total_bonos;
                    totalAntiguedad = totalAntiguedad + total_antiguedad;
                    montoTotalDiasSancionados = montoTotalDiasSancionados + monto_total_dias_sancionados;
                    totalDiasTrabajados = totalDiasTrabajados + row.dias_trabajados;
                    totalDiasSancionados =totalDiasSancionados + row.dias_sancionados;
                    //console.log("asis:", asistenciaJson);
                }
                
                
                //cálculo aporte nacional silidario
                
                const {total_aporte_solidario , aporte_sol_json} = calcularAporteSolidario( totalGanado, escalaApSol );
                
                //calculo de afps
                
                const {total_aporte_afp , aporte_afp_json} = calcularAporteAfp( totalGanado, listaAfpVigente, parametro.cod_edad_afp, parametro.edad_afp, parametro.cod_fecha_afp_edad, edadEmpleado, empleadoNoAportantes );
                //console.log("total aporte afp:", total_aporte_afp);
                
                //calculo de rciva
                const rcivaSaldoCertificado = await Rciva_certificacion.findOne( {where: { activo: 1, id_empleado:fila.id_empleado, id_mes:body.id_mes }} );
                const filaDescargo = await Rciva_descargo_salario.findOne( {where: { activo: 1, id_empleado:fila.id_empleado, id_mes:body.id_mes }} );
                const rciva_saldo_dependiente = await Rciva_planilla.findOne({
                    include:[
                        //{ association: 'rcivaplanilla_salarioplanilla',  attributes: {exclude:['createdAt','status','updatedAt']}},
                        { association: 'rcivaplanilla_planillafecha',  attributes: {exclude: ['createdAt','status','updatedAt']}, 
                        order: [['fecha', 'DESC']], // Ordena las asistencias por fecha descendente
                        }
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
                
                const calculo_rciva = await calcularRciva( parametro, fila.id_empleado, body.id_mes, totalGanado, rcivaSaldoCertificado, filaDescargo, rciva_saldo_dependiente, total_aporte_solidario, total_aporte_afp, viaticos, escalaRciva, novedad );
                //agregar parametros posteriores
                //calculo_rciva.novedad = novedad;
                //calculo_rciva.id_salario_planilla= 
                ///calculo descuentos
                const listDescuento = await Asignacion_descuento.findAll( {
                    attributes: [
                        'id', 
                        'id_tipo_descuento', 
                        'id_empleado', 
                        'monto',
                        'unidad', 
                        'fecha_inicio', 
                        'fecha_limite',
                        // Usamos sequelize.literal para manejar el CASE
                        // [literal(`CASE WHEN "Asignacion_descuento"."unidad" = '%' AND "asiganciondescuento_tipodes"."con_beneficiario" IS TRUE THEN `+totalGanado+` * (monto/100) ELSE monto END`), 'monto_descuento']
                    ],
                    include:[
                        { association: 'asiganciondescuento_tipodes',  attributes: [],}
                    ],
                    required: false,
                    where: { activo: 1, id_empleado:fila.id_empleado,
                            '$asiganciondescuento_tipodes.grupo$': { [Op.eq]: 'DESCUENTOS' },
                            [Op.and]: [
                                literal(`DATE_TRUNC('month', '`+periodo+`'::DATE ) BETWEEN DATE_TRUNC('month', fecha_inicio) AND COALESCE(DATE_TRUNC('month', fecha_limite), DATE_TRUNC('month', '`+periodo+`'::DATE))` )
                            ]
                            }
                        } );

                //console.log("lista descuentos:", listDescuento );
                const calculo_descuentos = calculoDescuento(listDescuento, totalDiasTrabajados, totalGanado);

                
                //calculo sanciones
                const listSanciones = await Asignacion_descuento.findAll( {
                    attributes: [
                        'id', 
                        'id_tipo_descuento', 
                        'id_empleado', 
                        'monto',
                        'unidad', 
                        'fecha_inicio', 
                        'fecha_limite',
                        // Usamos sequelize.literal para manejar el CASE
                        // [literal(`CASE WHEN "Asignacion_descuento"."unidad" = '%' AND "asiganciondescuento_tipodes"."con_beneficiario" IS TRUE THEN `+totalGanado+` * (monto/100) ELSE monto END`), 'monto_descuento']
                    ],
                    include:[
                        { association: 'asiganciondescuento_tipodes',  attributes: [],}
                    ],
                    required: false,
                    where: { activo: 1, id_empleado:fila.id_empleado,
                            '$asiganciondescuento_tipodes.grupo$': { [Op.eq]: 'SANCIONES' },
                            [Op.and]: [
                                literal(`DATE_TRUNC('month', '`+periodo+`'::DATE ) BETWEEN DATE_TRUNC('month', fecha_inicio) AND COALESCE(DATE_TRUNC('month', fecha_limite), DATE_TRUNC('month', '`+periodo+`'::DATE))` )
                            ]
                            }
                        } );

                //console.log("lista sanciones:", listSanciones );
                const calculo_sanciones = calculoDescuento(listSanciones, totalDiasTrabajados, totalGanado);
                //console.log("calculo descuentos:", calculo_sanciones);
                //calculo aporte patronal
                //calculo de afps

                
                //console.log("total aporte patronal:", total_aporte_patronal,"total gando:",totalGanado, "json......:", aporte_patronal_json);

                //calculo de liquido pagable
                
                let liquidoPagable =0;
                console.log("total ganado-----------------:", totalGanado, "edad empleado ---------------:", edadEmpleado);
                if (totalGanado > 0 && edadEmpleado > 0) {

                    // calculo de subsidio
                const listaAsigSubsidio = await Asignacion_subsidio.findAll( 
                    {   where: { id_empleado:fila.id_empleado, estado: 'AC', //fecha_inicio:{[Op.lte]: new Date (meses.fecha_limite) }  
                        [Op.and]: [
                            literal(`DATE_TRUNC('month', '`+periodo+`'::DATE ) BETWEEN DATE_TRUNC('month', fecha_inicio) AND COALESCE(DATE_TRUNC('month', fecha_limite), DATE_TRUNC('month', '`+periodo+`'::DATE))` )
                        ]
                        
                            }, 
                        include:[
                            { association: 'asigancionsubsidio_tipodes',  attributes: {exclude:['createdAt','status','updatedAt']}},
                            //{ association: 'asignacionbono_empleado',  attributes: {exclude: ['createdAt','status','updatedAt']},}
                        ]
                    } );
                const { total_subsidio, lista_json_subsidio } = calcularSubsidio( listaAsigSubsidio );
                totalGanado = totalGanado + total_subsidio;
                
                
                const { total_aporte_patronal , aporte_patronal_json } = calcularAportePatronal( totalGanado, listaPatronalVigente, parametro, edadEmpleado );



                    let rcIva = calculo_rciva?calculo_rciva.rciva_retenido:0;
                    let afps = total_aporte_afp;
                    let afp_solid_nacional = total_aporte_solidario;
                    let totalDescuentos = calculo_descuentos.total_monto_descuento? calculo_descuentos.total_monto_descuento:0;
                    let totalSanciones = calculo_sanciones.total_monto_descuento? calculo_sanciones.total_monto_descuento:0 ;
                    let totalSubsidio = total_subsidio;
                    let totalAuxiliar = rcIva + afps + afp_solid_nacional + totalDescuentos + totalSanciones + totalSubsidio;
                    let liquidoPagableAux = totalGanado - totalAuxiliar;
                    liquidoPagable = liquidoPagableAux >= 0 ? liquidoPagableAux : 0;
                    console.log("-----rciva:",rcIva," afps:",afps, " afp_solidario nacional:",afp_solid_nacional, " total descuentos:",totalDescuentos, " total sanciones:", totalSanciones, " total auxiliar:", totalAuxiliar, " liquido pagable Aux:", liquidoPagableAux, " liquido pagable:", liquidoPagable );
                    salariosPlanillasDatas.push({
                        id_mes: body.id_mes, //moment({ month: mes }).format('MMMM'),
                        id_empleado: fila.id_empleado,
                        id_asig_cargo: idAsigCargo,
                        asistencia: asistenciaJson,
                        edad_empleado: edadEmpleado,
                        haber_basico_dia: totalHaberBasico/30,
                        antiguedad: totalAntiguedad,
                        bonos: bonosJson,
                        total_bonos: totalBono,
                        subsidio: lista_json_subsidio,
                        total_subsidio: totalSubsidio,
                        total_ganado: totalGanado,
                        aporte_solidario: aporte_sol_json,
                        total_ap_solidario: total_aporte_solidario,
                        aporte_laboral_afp: aporte_afp_json,
                        total_afp: total_aporte_afp,
                        total_iva: calculo_rciva.rciva_retenido,
                        aporte_patronal: aporte_patronal_json,
                        total_patronal: total_aporte_patronal,
                        descuento_adm: calculo_descuentos.descuento_json,
                        total_descuento: calculo_descuentos.total_monto_descuento,
                        sanciones_adm: calculo_sanciones.descuento_json,
                        total_sanciones: calculo_sanciones.total_monto_descuento,
                        sancion_asistencia: montoTotalDiasSancionados,
                        liquido_pagable: liquidoPagable,
                        dias_trabajados: totalDiasTrabajados,
                        dias_sancionados: totalDiasSancionados,
                        activo:1,
                        id_user_create: Users.id
                    });
                    console.log( "planilla salarios****************", salariosPlanillasDatas );
                    rcivaPlanillasDatas.push( calculo_rciva );

                } else {

                    // console.log( "Asistencias del empleado .............:", fila, "nombre completo:", fila.numdocumento_completo, "total dias trabajados:", fila.total_dias_trabajados, "id_mes:", fila.id_mes );
                    
                    listaSinRegistro.push({
                        id_empleado:fila.id_empleado,
                        nombre_completo: fila.nombre_completo,
                        ci_empleado:fila.numdocumento_completo,
                    });
                    
                }
            }

            // Consulta para verificar si el id existe en la otra tabla
            //const existingRecord = await Salario_planilla.findOne({ where: { id_mes:body.id_mes, id_empleado:row.id_empleado, id_asig_cargo : row.id , activo:1 } });
        
            //console.log("json.............:", JSON.stringify(salariosPlanillasDatas));    
        }
        
        const salarioNew = await Salario_planilla.bulkCreate(salariosPlanillasDatas, { transaction: t });
        const rcivaNew = await Rciva_planilla.bulkCreate( rcivaPlanillasDatas, { transaction: t });

        await t.commit();
        return res.status(201).json({
            ok: true,   
            salarioNew,
            rcivaNew,
            listaSinRegistro
        });
    } catch (error) {
        console.log( error );
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
    let totalHaberBasico, montoTotalDiasSancionados ;
    const totalDiasTrabajados = diasTrabajados + diasSancionados;
    let haberBasicoDia =  haberBasico/30;
    if(totalDiasTrabajados === 30){ 
        totalHaberBasico = haberBasico; //por tema de decimales o redondeo
    }else{ ///prorratear dias trabajados
        totalHaberBasico = totalDiasTrabajados * haberBasicoDia;
    }
    montoTotalDiasSancionados = haberBasicoDia * diasSancionados;
    //console.log("dias trabajados---------------------------------------:", diasTrabajados, "dias sancionados:", diasSancionados, "haber basico:", haberBasico, "total haber basico", totalHaberBasico, "monto total dias sancionados:", montoTotalDiasSancionados );
    return {total_haber_basico:totalHaberBasico, monto_total_dias_sancionados:montoTotalDiasSancionados};
  }
function calcularAnioAntiguedad(fechaIngreso, fechaCorte, haberBasico, parametroAntigueda ) {
    const fechaIngresoMoment = moment(fechaIngreso);
    const fechaActual = moment(fechaCorte);
    let LimiteAntiguedad = parseFloat(parametroAntigueda);
    // Calculamos la diferencia en años entre ambas fechas
    const anioTrabajado =  fechaActual.diff(fechaIngresoMoment, 'years') ;
    let totalMontoAntiguedad;
    if(  anioTrabajado >=  LimiteAntiguedad ){
        totalMontoAntiguedad =  haberBasico;
    }else{
        totalMontoAntiguedad = haberBasico * ( anioTrabajado / LimiteAntiguedad );
    }
    console.log("Fecha ingreso:",fechaIngresoMoment, "fecha_actual:", fechaActual,"años trabajados", anioTrabajado, " limite antiguedad:",LimiteAntiguedad, "total monto antiguedad:", totalMontoAntiguedad);
    return totalMontoAntiguedad;
}
function totalGandoBs(totalHaberBasico, totalAntiguedad, totalBono) {
    let totalGanado = 0;
    if(totalHaberBasico > 0  &&  totalAntiguedad >=0 && totalBono >= 0  ){ 
        totalGanado = parseFloat(totalHaberBasico) + parseFloat(totalAntiguedad) + parseFloat(totalBono); //por tema de decimales o redondeo
        
    }
    console.log("total haber basico..............................:", totalHaberBasico, "total antiguedad:", totalAntiguedad, "total bono:", totalBono,  "total ganado:", totalGanado);
    
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

function calcularBono( haberBasico, antiguedad, listaAsigBonos, id_cargo ) {
    let totalBono = 0;
    let bonosPerYEve = [];
    //console.log("lista bonos:", listaBonos);
    for(const row of listaAsigBonos){
        //console.log("fila escala cumplidos:", row );
        const {resultado, porcentaje} = montoPorcentajeBono(haberBasico, antiguedad, row.asignacionbono_bono, id_cargo);
        bonosPerYEve.push({
            id_asig_bono: row.id,
            id_bono: row.id_bono, //moment({ month: mes }).format('MMMM'),
            id_cargo: id_cargo,
            monto_bs: resultado,
            suma: haberBasico + antiguedad,
            porcentaje: porcentaje,
            //nombre: row.asignacionbono_bono,nombre_abreviado

        });
        console.log("Total bonos:", bonosPerYEve);
        totalBono = parseFloat(totalBono) + parseFloat(resultado);
    }
    console.log("---------haber basico:",haberBasico, "antiguedad:", antiguedad,"Total bono antiguedad:",totalBono, "lista bonos:",listaAsigBonos );
    return {total_bonos: totalBono, lista_json_bono:bonosPerYEve};
}
function montoPorcentajeBono(haberBasico, antiguedad, listaBono, id_cargo) {
    let resultado = 0;
    let porcentaje_escala = 0;
    if(listaBono.nombre_abreviado === 'B.Jerarquico'){
        //buscar en json el cargo y porcentaje
        for(const fila of listaBono.porcen_cargo){
            if(id_cargo === fila.id_cargo){
                porcentaje_escala = fila.porcentaje;
            }
        }
    }else{
        porcentaje_escala = listaBono.porcentaje;
    }
    //console.log("cal bono, haber basico:", haberBasico, "antiguedad:",antiguedad, "porcentaje:",porcentaje_escala);
    if (haberBasico > 0 && porcentaje_escala >= 0 && antiguedad >= 0) {
        suma_bs = parseFloat( haberBasico)  + parseFloat(antiguedad );
        resultado = (suma_bs >= 0) ? suma_bs * (porcentaje_escala / 100) : 0;
        //console.log("resultado cal bono:", resultado, "suma:", suma_bs);
    }
    
    return {resultado:resultado, porcentaje:porcentaje_escala };
}
function calcularSubsidio( listaAsigSubsidio ) {
    let totalSubsidio = 0;
    let subsudios = [];
    //console.log("lista bonos:", listaBonos);
    for(const row of listaAsigSubsidio){
        //console.log("fila escala cumplidos:", row );
        subsudios.push({
            id_asig_subsidio: row.id,
            monto: row.monto,
            nombre_subsidio: row.asigancionsubsidio_tipodes.nombre
        });
        console.log("Total subsidio:", subsudios );
        totalSubsidio = totalSubsidio + parseFloat(row.monto);
    }
    console.log("total subsidio:",totalSubsidio, "lista subsidios:",subsudios );
    return { total_subsidio: totalSubsidio, lista_json_subsidio:subsudios };
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
    return {total_aporte_afp: totalAporte, aporte_afp_json: aporte_afp_json};
}
function calculoMontoAporteAFP(totalGanado, porcentaje, certificado, aplicaEdadAFP, edadLimiteAfp, edadEmpleado, empleadoNoAportantes) {
    let resultado = 0;
    //$periodoAplicacion = EmpleadoNoaportante::periodoAplicacionCertificacionCesacionSIP($id_empleado); // 05/2019        
    let id_noaporta;
    //console.log("total ganado:", totalGanado, "porcentaje:", porcentaje, "certificado:", certificado, "aplica Edad Afp:", aplicaEdadAFP, "edad Limite afp:", edadLimiteAfp, "edad empleado:", edadEmpleado, "empleados no aportantes:", empleadoNoAportantes);
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

async function calcularRciva( parametro, idEmpleado, id_mes, totalGanado, rcivaSaldoCertificado, filaDescargo, rcivaSaldoDependiente, totalAporteNacionalSolidario, totalAFPS, viaticos, escalaRciva, novedad ){
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
    const idMesAnterior = parametro.id_mes_ant;
    const totalViaticos = viaticos.importe? parceFloat( viaticos.importe ):0;
    const ufvActual = parametro.ufv_act;
    const idUfvActual = parametro.id_ufv_act;
    const ufvAnt = parametro.ufv_ant;
    const idUfvAnt = parametro.id_ufv_ant;

    if(rcivaSaldoDependiente ||  (rcivaSaldoCertificado ) || (totalGanado >= totalGanadoActivo)){            
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
            let porcentajeForm110 =  filaDescargo ? filaDescargo.importe_rciva : 0;
            let idDescargoRCIVA = filaDescargo ? filaDescargo.id : null;
            let saldoFavorFisco = impuestoNetoRCIVA > porcentajeForm110 ? impuestoNetoRCIVA - porcentajeForm110 : 0;
            let saldoFavorDependiente = porcentajeForm110 > impuestoNetoRCIVA ? porcentajeForm110 - impuestoNetoRCIVA : 0;

            // certificado solo para el caso de que el empleado sea nuevo  
            let idCertificadoSaldoRCIVA = null;
            let codigoSaldo = null;
            let montoSaldo = null;
            let fechaSaldo = null;
            let listaSaldoMantenimiento = null;
            if(rcivaSaldoCertificado){
                idCertificadoSaldoRCIVA = rcivaSaldoCertificado.id;
                codigoSaldo = rcivaSaldoCertificado.impuesto_numero;
                montoSaldo = rcivaSaldoCertificado.impuesto_saldo;
                fechaSaldo = rcivaSaldoCertificado.impuesto_fecha_saldo;
                listaSaldoMantenimiento =   await actualizacionCertificadoRciva(id_mes, idEmpleado, ufvActual, montoSaldo, fechaSaldo );
            }  

            
            
            // const dataUfvActual = await processExcel(fechaPlanillaRcivaActual);
            // valorUfv(fechaPlanillaRcivaActual)
            // .then(resultado => {
            //     ufvActual = resultado.dataValues.valor;
            //     idUfvActual = resultado.dataValues.id;
            //     //console.log('Resultado del cálculo RC-IVA:', resultado);
            // })
            // .catch(error => {
            //     console.error('Error en el proceso:', error);
            // });

            
            
            let existeObservacion = listaSaldoMantenimiento? listaSaldoMantenimiento.observado:true;                       
            // saldo del periodo anterior del empleado  --- saldo, fecha_saldo, mantenimiento,actualizado
            let filaSaldoRCIVA = saldoRcIvaMesAnteriorConActualizacionOneItem( ufvActual, idUfvActual,idMesAnterior, rcivaSaldoDependiente, idUfvAnt, ufvAnt);
            let saldoPeriodoAnterior = filaSaldoRCIVA.saldo? parseFloat( filaSaldoRCIVA.saldo ):0;
            let valorMantenimiento = filaSaldoRCIVA.mantenimiento? parseFloat( filaSaldoRCIVA.mantenimiento ):0;
            let saldoActualizado = filaSaldoRCIVA.actualizado? parseFloat(filaSaldoRCIVA.actualizado):0;
            
            //sino tiene observacion el saldo se suma y se guarda            
            if(!existeObservacion){
                saldoPeriodoAnterior = saldoPeriodoAnterior + parseFloat( listaSaldoMantenimiento.saldo );
                valorMantenimiento = valorMantenimiento + parseFloat( listaSaldoMantenimiento.mantenimiento );
                saldoActualizado = saldoActualizado + parseFloat( listaSaldoMantenimiento.saldoactualizado );
            }
            // saldo utilizado
            let saldoUtilizado = saldoActualizado <= saldoFavorFisco ? saldoActualizado : saldoFavorFisco;
            let impuestoRCIVARetenido = saldoFavorFisco > saldoUtilizado ? (saldoFavorFisco - saldoUtilizado) : 0;
            let saldoCreditoFiscalDependiente = saldoFavorDependiente + saldoActualizado - saldoUtilizado;
            // console.log("parametros:", parametro);
            // console.log("descargo", filaDescargo);
            // console.log("certificacion:", rcivaSaldoCertificado);
        return !existeObservacion? {
                id_mes : id_mes,
                id_minimo_nacional : idMinNacionalActivo,
                id_escala_rciva : escalaRciva.id,
                //id_salario_planilla : null,
                id_empleado: idEmpleado,
                id_rciva_certificado : idCertificadoSaldoRCIVA,
                id_rciva_planilla_fecha : idFechaPlanillaRcivaActual,
                novedad : novedad,
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
function saldoRcIvaMesAnteriorConActualizacionOneItem(  ufvActual, idUfvActual, idMesAnterior, filaSaldoAnterior, idUfvAnterior, ufvAnterior) {
    let valorMantenimiento = 0;
    let saldoActualizado = 0;
    let saldoRciva = 0;
    let fechaSaldoRciva = null;
    // let ufvAnterior;
    // let idUfvAnterior;
    if (idMesAnterior > 0 && filaSaldoAnterior ){
        //$saldoRciva = isset($filaSaldoAnterior['saldo_rciva_dependiente']) ? $filaSaldoAnterior['saldo_rciva_dependiente'] : 0;
        if( filaSaldoAnterior.saldo_rciva_dependiente_dos  ){
            saldoRciva = filaSaldoAnterior.saldo_rciva_dependiente_dos;
        }else if( filaSaldoAnterior.saldo_rciva_dependiente ){
            saldoRciva = filaSaldoAnterior.saldo_rciva_dependiente;
        }else{
            saldoRciva = 0;
        }
        fechaSaldoRciva = filaSaldoAnterior ? filaSaldoAnterior.rcivaplanilla_planillafecha.dataValues.fecha_limite : null;
        //si tyiene saldo
        if (saldoRciva > 0) {
            // ufv actual
            //ufv anterior
            
            // valorUfv(fechaSaldoRciva)
            // .then(resultado => {
            //     ufvAnterior = resultado.dataValues.valor;
            //     idUfvAnterior = resultado.dataValues.id;
            //     //console.log('Resultado del cálculo RC-IVA:', resultado);
            // })
            // .catch(error => {
            //     console.error('Error en el proceso:', error);
            // });
            // valor del mantenimiento del saldo
            valorMantenimiento = valorMantenimientoActualizacionUFV(ufvActual, ufvAnterior, saldoRciva);
            saldoActualizado = saldoRciva + valorMantenimiento;
        }
    }
    //console.log("?????????? fila Saldo anterior:",filaSaldoAnterior.rcivaplanilla_planillafecha.dataValues.fecha_limite,"fecha saldo anterior:",fechaSaldoRciva, " id mes anterior:", idMesAnterior,"ufv anterior:", ufvAnterior, "id ufv anterior:",idUfvAnterior, "ufv acutal:",ufvActual, "id ufv actual:",idUfvActual, "saldo actualizado:",saldoActualizado,"mantenimiento:", valorMantenimiento  );
    

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
async function actualizacionCertificadoRciva(idMes, idEmpleado, ufvActual, montoSaldo, fecha) {
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
        id_empleado : idEmpleado, 
        fecha_saldo : fechaSaldo, 
        saldo: saldoRciva,
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
      console.log("############################### ufv:",ufvData);
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
function calculoDescuento( listDescuento, totalDiasTrabajados, totalGanado){

    let totalMontoDescuento =0;
    let descuento_json = [];
    for( const row of listDescuento ) {
        const idAsignacionDescuento = row.id;
        const idTipoDescuento = row.id_tipo_descuento;
        let monto_descuento= 0;
        if(row.unidad==='%'){
           monto_descuento =  totalGanado * parseFloat(row.monto)/100 ;
        }else{
            monto_descuento = parseFloat(row.monto);
        }
        let monto = totalDiasTrabajados === 0 ? 0: monto_descuento;
        // console.log("dias trabajados:", totalDiasTrabajados, "descuentos:", monto_descuento, "monto:", monto);
        // console.log("row:",row.monto);
        monto = Math.round((monto + Number.EPSILON) * 100) / 100; //redondeo a dos decimales
        totalMontoDescuento = totalMontoDescuento + monto;

        descuento_json.push({
            id_asig_descuento: idAsignacionDescuento,
            id_tipo_descuento: idTipoDescuento,
            monto: monto,            
        });
    }
    console.log("--------- Lista descuento:", totalMontoDescuento, "calculo descuento:", descuento_json);
    return { descuento_json: descuento_json, total_monto_descuento: totalMontoDescuento }
    
        
}
function calcularAportePatronal( totalGanado, listaPatronalVigente, parametro, edad_empleado){
    let totalAporte = 0;
    let aporte_patronal_json = [];
    for( const row of listaPatronalVigente ) {
        const id_escala_afp = row.id;
        const porcentaje = row.porcentaje;
        const aplicaEdadLimite = row.aplica_edad_limite;
        
        if ( parametro.edad_afp > 0 ) { // si no existe registro (!$existeRegistro) se guarda
            const calculo = calculoMontoAportePatronal(totalGanado, porcentaje, aplicaEdadLimite, parametro.edad_afp, edad_empleado);
            totalAporte = totalAporte + calculo ;

            aporte_patronal_json.push({
                id_escala_afp: id_escala_afp,
                porcentaje: porcentaje,
                monto: calculo,
                id_edad_afp: parametro.cod_edad_afp,
            });
        }
    }
    return { total_aporte_patronal: totalAporte, aporte_patronal_json: aporte_patronal_json };
}

function calculoMontoAportePatronal(totalGanado, porcentaje, aplicaEdadAFP, edadLimiteAfp, edadEmpleado) {
    let resultado = 0;
    
    if (aplicaEdadAFP && edadEmpleado >= edadLimiteAfp) {
        resultado = 0;
        
    } else {
        resultado = totalGanado * (porcentaje / 100);
    }

    return resultado;
}
// function calculoSanciones( listSanciones, totalDiasTrabajados, totalGanado){

//     let totalMontoSancion =0;
//     let sanciones_json = [];
//     for( const row of listSanciones ) {
//         const idAsignacionDescuento = row.id;
//         const idTipoDescuento = row.id_tipo_descuento;
//         let monto_sancion= 0;
//         if(row.unidad==='%'){
//            monto_sancion =  totalGanado * parseFloat(row.monto)/100 ;
//         }else{
//             monto_sancion = parseFloat(row.monto);
//         }
//         let monto = totalDiasTrabajados === 0 ? 0: monto_sancion;
//         // console.log("dias trabajados:", totalDiasTrabajados, "descuentos:", monto_descuento, "monto:", monto);
//         // console.log("row:",row.monto);
//         monto = Math.round((monto + Number.EPSILON) * 100) / 100; //redondeo a dos decimales
//         totalMontoSancion = totalMontoSancion + monto;

//         sanciones_json.push({
//             id_asig_descuento: idAsignacionDescuento,
//             id_tipo_descuento: idTipoDescuento,
//             monto: monto,            
//         });
//     }

//     return { sanciones_json: sanciones_json, total_monto_sancion: totalMontoSancion }
    
        
// }



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