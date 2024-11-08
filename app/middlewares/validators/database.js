const {
    Users,
    Empleado,
    TipoEvaluacion,
    CriterioEvaluacion,
    Ufv,
    Mes,
    Gestion,
    Tipo_planilla,
    Tipo_descuento_sancion,
    Asignacion_descuento,
    Beneficiario_acreedor,
    Asignacion_sancion,
    Seguro,
    Seguro_empleado,
    Minimo_nacional_salario,
    Configuracion_minimo_nacional,
    Aporte_empleado,
    Aporte,
    Tipo_movimiento,
    Asignacion_cargo_empleado,
    Incremento,
    Asistencia,
    Escala_rciva_salario,
    Planilla_fecha,
    Rciva_certificacion,
    Rciva_descargo_salario,
    Rciva_planilla,

    
  } = require("../../database/config");
  
  // ========================= USER VALIDATE ============================
  const idExistUser = async (id = "") => {
    const idExist = await Users.findByPk(id);
    if (!idExist) {
      throw new Error(`El usuario con id: ${id}, no existe`);
    }
  };
  const emailExistUser = async (email = "",{req}) => {
    const { id } = req.params;
    const existDB = await Users.findOne({ where: { email } });
    if(!existDB) return;
    if (existDB.id != id) {
      throw new Error(`El usuario con email: ${email}, ya existe`);
    }
  };
  const ciExistUser = async (ci = "",{req}) => {
    const { id } = req.params;
    const existDB = await Users.findOne({ where: { ci } });
    if(!existDB) return;
    if (existDB.id != id) {
      throw new Error(`El usuario con ci: ${ci}, ya existe`);
    }
  };
  // ===========================================================
  // ========================= EMPLEADO VALIDATE =================
  const idExistEmpleado= async (id = "") => {
    const idExist = await Empleado.findByPk(id);
    if (!idExist) {
      throw new Error(`El empleado con id: ${id}, no existe`);
    }
  };
  const ciExistEmpleado = async (ci = "",{req}) => {
    const { id } = req.params;
    const existDB = await Empleado.findOne({ where: { ci } });
    if(!existDB) return;
    if (existDB.id != id) {
      throw new Error(`El usuario con ci: ${ci}, ya existe`);
    }
  };
  // =================================================================
  // ========================= UFV ===================================
  const idExistUfv= async (id = "") => {
    const idExist = await Ufv.findOne( { where: {id} });
    if (!idExist) {
      throw new Error(`La ufv con id: ${id}, no existe`);
    }
  };
  // const uuidExistCurso= async (uuid = "") => {
  //   const idExist = await Curso.findOne( { where: {uuid} });
  //   if (!idExist) {
  //     throw new Error(`La curso con uuid: ${uuid}, no existe`);
  //   }
  // };
  // const codExistCurso = async (codigo = "",{req}) => {
  //   const { uuid } = req.params;
  //   const codExistDB = await Curso.findOne({ where: {codigo} });
  //   if (!codExistDB) return;
  //   if (codExistDB.uuid != uuid){
  //     throw new Error(`El curso con código: ${codigo}, ya existe`);
  //   }
  // };
  // const nameExistCurso = async (nombre = "",{req}) => {
  //   const { uuid } = req.params;
  //   const nameExist = await Curso.findOne({ where: { nombre } });
  //   if(!nameExist) return;
  //   if (nameExist.uuid != uuid) {
  //     throw new Error(`El curso con nombre: ${nombre}, ya existe`);
  //   }
  // };
  // =================================================================
  // ===================== GESTION ============================
  const idExistGestion = async (id = "") => {
    const idExist = await Gestion.findByPk(id);
    if (!idExist) {
      throw new Error(`La gestion con id: ${id}, no existe`);
    }
  };
  const nameExistGestion = async (gestiones = "",{req}) => {
    const { id } = req.params;
    const nameExist = await Gestion.findOne({ where: { gestiones } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`La gestion o año con nombre: ${gestiones}, ya existe`);
    }
  };
  // =================================================================
  // ===================== MES ============================
  const idExistMes = async (id = "") => {
    const idExist = await Mes.findByPk(id);
    if (!idExist) {
      throw new Error(`El mes con id: ${id}, no existe`);
    }
  };
  
  // =================================================================
  // ===================== TIPO PLANILLA ============================
  const idExistTipoPlanilla = async (id = "") => {
    const idExist = await Tipo_planilla.findByPk(id);
    if (!idExist) {
      throw new Error(`Tipo Planilla con id: ${id}, no existe`);
    }
  };
  const codExistTipoPlanilla = async (nombre = "",{req}) => {
    const { id } = req.params;
    const nameExist = await Tipo_planilla.findOne({ where: { nombre } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`El tipo planilla con código: ${nombre}, ya existe`);
    }
  };

  // =================================================================
  // ========================= Tipo Descuento Sanciones =======================
  const idExistTipoDescuento= async (id = "") => {
    const idExist = await Tipo_descuento_sancion.findByPk(id);
    if (!idExist) {
      throw new Error(`Tipo descuento sancion con id: ${id}, no existe`);
    }
  };
  const nameExistTipoDescuento = async (nombre = "",{req}) => {
    const { id } = req.params;
    const nameExist = await Tipo_descuento_sancion.findOne({ where: { nombre } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`El tipo descuento sanción con nombre: ${nombre}, ya existe`);
    }
  };
  const nameCortoExistTipoDescuento = async (nombre_abreviado = "",{req}) => {
    const { id } = req.params;
    const nameExist = await Tipo_descuento_sancion.findOne({ where: { nombre_abreviado } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`El tipo descuento sanción con nombre: ${nombre_abreviado}, ya existe`);
    }
  };

  // =================================================================
  // ========================= Asignacion Sanciones =======================
  const idExistAsigDescuento = async (id = "") => {
    const idExist = await Asignacion_descuento.findByPk(id);
    if (!idExist) {
      throw new Error(`La asignación descuento con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== Beneficiario acreedor =======================
  const idExistBenefAcreedor = async (id = "") => {
    const idExist = await Beneficiario_acreedor.findByPk(id);
    if (!idExist) {
      throw new Error(`El benficiario acreedor con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== ASIGANCION SANCION =======================
  const idExistAsigSancion = async (id = "") => {
    const idExist = await Asignacion_sancion.findByPk(id);
    if (!idExist) {
      throw new Error(`El benficiario acreedor con id: ${id}, no existe`);
    }
  };
  
  // =================================================================
  // ===================== SEGURO =======================
  const idExistSeguro = async (id = "") => {
    const idExist = await Seguro.findByPk(id);
    if (!idExist) {
      throw new Error(`El seguro con id: ${id}, no existe`);
    }
  };
  const codigoExistSeguro = async (codigo = "",{req}) => {
    const { id } = req.params;
    const codigoExist = await Seguro.findOne({ where: { codigo } });
    if(!codigoExist) return;
    if (codigoExist.id != id) {
      throw new Error(`El seguro con nombre: ${codigo}, ya existe`);
    }
  };
  // =================================================================
  // ===================== SEGURO EMPLEADO=======================
  const idExistSeguroEmp = async (id = "") => {
    const idExist = await Seguro_empleado.findByPk(id);
    if (!idExist) {
      throw new Error(`El Seguro empleado acreedor con id: ${id}, no existe`);
    }
  };
  
  // =================================================================
  // ===================== MINIMO NACIONAL SALARIO =======================
  const idExistMinSalario = async (id = "") => {
    const idExist = await Minimo_nacional_salario.findByPk(id);
    if (!idExist) {
      throw new Error(`El Seguro empleado acreedor con id: ${id}, no existe`);
    }
  };
  
  const montoExistMinSalario = async (monto_bs = "",{req}) => {
    const { id } = req.params;
    const montoExist = await Minimo_nacional_salario.findOne({ where: { monto_bs } });
    if(!montoExist) return;
    if (montoExist.id != id) {
      throw new Error(`El minimo nacional salario con monto: ${monto_bs}, ya existe`);
    }
  };
  // =================================================================
  // ===================== MINIMO NACIONAL SALARIO =======================
  const idExistConfigMinNacional = async (id = "") => {
    const idExist = await Configuracion_minimo_nacional.findByPk(id);
    if (!idExist) {
      throw new Error(`La configuracion de minimo nacional con id: ${id}, no existe`);
    }
  };
  
  // =================================================================
  // ===================== APORTE =======================
  const idExistAporte = async (id = "") => {
    const idExist = await Aporte.findByPk(id);
    if (!idExist) {
      throw new Error(`El aporte con id: ${id}, no existe`);
    }
  };
  const codigoExistAporte = async (codigo = "",{req}) => {
    const { id } = req.params;
    const codigoExist = await Aporte.findOne({ where: { codigo } });
    if(!codigoExist) return;
    if (codigoExist.id != id) {
      throw new Error(`El aporte con nombre: ${codigo}, ya existe`);
    }
  };
  // =================================================================
  // ===================== APORTE EMPLEADO=======================
  const idExistAporteEmp = async (id = "") => {
    const idExist = await Aporte_empleado.findByPk(id);
    if (!idExist) {
      throw new Error(`El Aporte empleado acreedor con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== CATEGORIA CARGO =======================
  const idExistCatCargo = async (id = "") => {
    const idExist = await Categoria_cargo.findByPk(id);
    if (!idExist) {
      throw new Error(`La categoria del cargo con id: ${id}, no existe`);
    }
  };
  const nameExistCatCargo = async (nombre = "",{req}) => {
    const { id } = req.params;
    const nombreExist = await Categoria_cargo.findOne({ where: { nombre } });
    if(!nombreExist) return;
    if (nombreExist.id != id) {
      throw new Error(`La categoria cargo con nombre: ${nombre}, ya existe`);
    }
  };
  // =================================================================
  // ===================== CARGO =======================
  const idExistCargo = async (id = "") => {
    const idExist = await Cargo.findByPk(id);
    if (!idExist) {
      throw new Error(`El cargo con id: ${id}, no existe`);
    }
  };
  const codigoExistCargo = async (codigo = "",{req}) => {
    const { id } = req.params;
    const codigoExist = await Cargo.findOne({ where: { codigo } });
    if(!codigoExist) return;
    if (codigoExist.id != id) {
      throw new Error(`El codigo con nombre: ${codigo}, ya existe`);
    }
  };
  // =================================================================
  // =====================  TIPO DE MOVIMEINTO =======================
  const idExistTipoMov = async (id = "") => {
    const idExist = await Tipo_movimiento.findByPk(id);
    if (!idExist) {
      throw new Error(`El tipo movimiento con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== ASIGNACION CARGO EMPLEADO ============================
  const idExistAsigCargoEmp = async (id = "") => {
    const idExist = await Asignacion_cargo_empleado.findByPk(id);
    if (!idExist) {
      throw new Error(`La asignacion del cargo al empleado con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== INCREMENTO ============================
  const idExistIncremento = async (id = "") => {
    const idExist = await Incremento.findByPk(id);
    if (!idExist) {
      throw new Error(`El incremento con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== ASISTENCIA ============================
  const idExistAsistencia = async (id = "") => {
    const idExist = await Asistencia.findByPk(id);
    if (!idExist) {
      throw new Error(`La asistencia con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== ESCALA RCIVA SALARIO ======================
  const idExistEscalaRciva = async (id = "") => {
    const idExist = await Escala_rciva_salario.findByPk(id);
    if (!idExist) {
      throw new Error(`La escala rciva salario con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== PLANILLA FECHA ======================
  const idExistPlanFecha = async (id = "") => {
    const idExist = await Planilla_fecha.findByPk(id);
    if (!idExist) {
      throw new Error(`La planilla fecha con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== RCIVA CERTIFICACIONES ======================
  const idExistRcivaCert = async (id = "") => {
    const idExist = await Rciva_certificacion.findByPk(id);
    if (!idExist) {
      throw new Error(`La certificación rciva con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== RCIVA DESCARGO SALARIOS ======================
  const idExistRcivaDescargo = async (id = "") => {
    const idExist = await Rciva_descargo_salario.findByPk(id);
    if (!idExist) {
      throw new Error(`La certificación rciva con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ===================== PLANILLA SALARIO ======================
  const idExistRcivaPlanilla = async (id = "") => {
    const idExist = await Rciva_planilla.findByPk(id);
    if (!idExist) {
      throw new Error(`El rciva planilla con id: ${id}, no existe`);
    }
  };
  
  
  // =================================================================
  // ========================= Criterio Evaluacion =======================
  const idExistCriterioEva = async (id = "") => {
    const idExist = await CriterioEvaluacion.findByPk(id);
    if (!idExist) {
      throw new Error(`El Criterio Evaluacion con id: ${id}, no existe`);
    }
  };
  const nameExistCriterioEva = async (nombre = "",{req}) => {
    const { id } = req.params;
    const nameExist = await CriterioEvaluacion.findOne({ where: { nombre } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`El criterio evaluación con nombre: ${nombre}, ya existe`);
    }
  };  
  // =================================================================
  // ========================= Resap =======================
  const idExistResap = async (id = "") => {
    const idExist = await Resap.findByPk(id);
    if (!idExist) {
      throw new Error(`El Resap con id: ${id}, no existe`);
    }
  };  
  // ===========================================================
  // ========================= WORKER VALIDATE =================
/*  const idExistWorker = async (id = "") => {
    const idExist = await Workers.findByPk(id);
    if (!idExist) {
      throw new Error(`El integrante con id: ${id}, no existe`);
    }
  };
  const emailExistWorker = async (email = "",{req}) => {
    const { id } = req.params;
    const existDB = await Workers.findOne({ where: { email } });
    if(!existDB) return;
    if (existDB.id != id) {
      throw new Error(`El Integrante con email: ${email}, ya existe`);
    }
  };
  const ciExistWorker = async (ci = "",{req}) => {
    const { id } = req.params;
    const existDB = await Workers.findOne({ where: { ci } });
    if(!existDB) return;
    if (existDB.id != id) {
      throw new Error(`El Integrante con ci: ${ci}, ya existe`);
    }
  };
  // ===========================================================
  // ========================= MACHINE =========================
  const idExistMachinery = async (id = "") => {
    const idExist = await Machineries.findByPk(id);
    if (!idExist) {
      throw new Error(`La maquinaria con id: ${id}, no existe`);
    }
  };
  
  // =================================================================
  // ========================= ACTIVITIES ============================
  const idExistActivity = async (id = "") => {
    const idExist = await Activities.findByPk(id);
    if (!idExist) {
      throw new Error(`La actividad con id: ${id}, no existe`);
    }
  };
  const nameExistActivity = async (name = "",{req}) => {
    const { id } = req.params;
    const nameExist = await Activities.findOne({ where: { name } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`La actividad con nombre: ${name}, ya existe`);
    }
  };
  // =================================================================
  // ========================= GROUPS ================================
  const idExistGroups = async (id = "") => {
    const idExist = await Groups.findByPk(id);
    if (!idExist) {
      throw new Error(`El grupo con id: ${id}, no existe`);
    }
  };
  const nameExistGroup = async (name = "",{req}) => {
    const { id } = req.params;
    const nameExist = await Groups.findOne({ where: { name } });
    if(!nameExist) return;
    if (nameExist.id != id) {
      throw new Error(`El grupo con nombre: ${name}, ya existe`);
    }
  };
  // =================================================================
  // ========================= GROUPS OF MEMBERS======================
  const idExistGroupsMembers = async (id = "") => {
    const idExist = await GroupOfMembers.findByPk(id);
    if (!idExist) {
      throw new Error(`El grupo de integrantes con id: ${id}, no existe`);
    }
  };
  const idWorkerExistInGroupMembers = async (req, res = response, next) => {
    const { id_worker, id_group } = req.body;
    const existWorkerMember = await GroupOfMembers.findOne({
      where: { id_worker, id_group, status:true },
    });
    if (existWorkerMember) {
      return res.status(422).json({
        ok: false,
        errors: [
          {
            value: id_worker,
            msg: `El integrante, ya existe en el grupo seleccionado`,
          },
        ],
      });
    } else {
      next();
    }
  };
  // =================================================================
  // ========================= ASSIGNMENTS =========================
  const idExistAssignment = async (id = "") => {
    const idExist = await Assignments.findByPk(id);
    if (!idExist) {
      throw new Error(`La asignación con id: ${id}, no existe`);
    }
  };
  // =================================================================
  // ========================= JOBS ===========================
  const idExistJobs= async (id = "") => {
    const idExist = await Jobs.findByPk(id);
    if (!idExist) {
      throw new Error(`La trabajo con id: ${id}, no existe`);
    }
  };
  const idActivityExistInJob = async (req, res = response, next) => {
    const { id_activity, id_assignament } = req.body;
    const existActivityInJob = await Jobs.findOne({
      where: { id_activity, id_assignament, status:'EN PROGRESO' },
    });
    if (existActivityInJob) {
      return res.status(422).json({
        ok: false,
        errors: [
          {
            value: id_activity,
            msg: `La actividad, ya existe en la asignación`,
          },
        ],
      });
    } else {
      next();
    }
  };
  // =================================================================
  // ========================= GROUP OF MACHINE ===========================
  const idExistGroupOfMachines= async (id = "") => {
    const idExist = await GroupOfMachines.findByPk(id);
    if (!idExist) {
      throw new Error(`La grupo de maquinas con id: ${id}, no existe`);
    }
  };
  const idMachineExistInJobId = async (req, res = response, next) => {
    const { id_job, id_machine } = req.body;
    const existWorkerMember = await GroupOfMachines.findOne({
      where: { id_job, id_machine },
    });
    if (existWorkerMember) {
      return res.status(422).json({
        ok: false,
        errors: [
          {
            value: id_machine,
            msg: `La maquina, ya esta designado en el trabajo`,
          },
        ],
      });
    } else {
      next();
    }
  };
  // =================================================================
  // ========================= JOBS REPORT ===========================
  const idExistJobsReport= async (idJobReport = "") => {
    const idExist = await JobsReport.findByPk(idJobReport);
    if (!idExist) {
      throw new Error(`La reporte de trabajo con id: ${id}, no existe`);
    }
  };
  const idExistJobReportDay = async (req, res = response, next) => {
    const { date, id_location} = req.body;
    const existWorkerMember = await JobsReport.findOne({
      where: { id_location, date },
    });
    if (existWorkerMember) {
      return res.status(422).json({
        ok: false,
        errors: [
          {
            value: date,
            msg: `Ya existe un reporte para la fecha ${date} con id_location: ${id_location}`,
          },
        ],
      });
    } else {
      next();
    }
  };
  // =================================================================
  const idExistLocation = async (id_location = "") => {
    const existLocation = await Locations.findByPk(id_location);
    if (!existLocation) {
      throw new Error(`La locación con id_location: ${id_location}, no existe`);
    }
  };
  */
  // =================================================================
  module.exports = {
    //idExistLocation,
    idExistUser,
    emailExistUser,
    ciExistUser,
    idExistEmpleado,
    ciExistEmpleado,
    idExistUfv,
    idExistGestion,
    nameExistGestion,
    idExistMes,
    idExistTipoPlanilla,
    codExistTipoPlanilla,    
    idExistTipoDescuento,
    nameExistTipoDescuento,
    nameCortoExistTipoDescuento,
    idExistAsigDescuento,
    idExistBenefAcreedor,
    idExistAsigSancion,
    idExistSeguro,
    codigoExistSeguro,
    idExistSeguroEmp,
    idExistMinSalario,
    montoExistMinSalario,
    idExistConfigMinNacional,
    idExistAporte,
    codigoExistAporte,
    idExistAporteEmp,
    idExistCatCargo,
    nameExistCatCargo,
    idExistCargo,
    codigoExistCargo,
    idExistTipoMov,
    idExistAsigCargoEmp,
    idExistIncremento,
    idExistAsistencia,
    idExistEscalaRciva,
    idExistPlanFecha,
    idExistRcivaCert,
    idExistRcivaDescargo,
    idExistRcivaPlanilla,

    idExistCriterioEva,
    nameExistCriterioEva,
    idExistResap
  
  };
  