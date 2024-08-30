'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION public.fun_parametros_iniciales(IN idmes integer,OUT total_empleados integer,OUT edad_afp integer,OUT fecha_corte_edad timestamp with time zone,OUT total_aporte_solidario numeric,OUT salario_minimo numeric,OUT rciva_obligatorio numeric,OUT total_salmin_rciva integer,OUT fecha_rciva_ant timestamp with time zone,OUT fecha_rciva_act timestamp with time zone,OUT ufv_ant numeric,OUT ufv_act numeric,OUT total_salmin_anioservicio numeric,OUT periodo_literal character varying,OUT fecha_corte_antiguedad timestamp with time zone)
    RETURNS SETOF record
    LANGUAGE 'plpgsql'
    VOLATILE
    PARALLEL UNSAFE
    COST 100    ROWS 1000 
    
AS $BODY$
/**************************************************************************
 SISTEMA:		Sistema de Planillas
 FUNCION: 		public.fun_salario_empleados_item_activo
 DESCRIPCION:   Funcion empleados activos
 AUTOR: 		Nelson Vargas
 COMENTARIOS:
***************************************************************************/

declare
	parametros_ini record;
	periodo timestamp with time zone;
	periodoAnt timestamp with time zone;
	idMesAnt integer:=0;
	totalEmpleados integer:=0;
	edadAfp integer:=0;
	fechaCorteEdad timestamp with time zone;
	totalAporteSolidario numeric:=0;
	salarioMinimo numeric:=0;
	rcivaObligatorio numeric:=0;
	totalSalMinRciva integer;
	fechaRcivaAnt timestamp with time zone;
	fechaRcivaAct timestamp with time zone;
	ufvAnt numeric:=0;
	ufvAct numeric:=0;
	totalSalMinAnioServicio numeric:=0;
	periodoLiteral character varying;
	fechaCorteAntiguedad timestamp with time zone;
	
begin
   	
select meses.fecha_inicio, CONCAT(meses.mes_literal ,' ', gestiones.gestiones) into periodo, periodoLiteral from meses inner join gestiones on gestiones.id = meses.id_gestion where meses.id= idMes;
-- mes anterior
periodoAnt := periodo - INTERVAL '1 month'; 

select id into idMesAnt from meses where  DATE_TRUNC('month', periodoAnt) BETWEEN DATE_TRUNC('month', fecha_inicio) AND DATE_TRUNC('month', fecha_limite) ;

WITH cte AS (
    SELECT 
        MAX(id) AS idasignacion,
        id_empleado AS idempleado
    FROM 
        asignacion_cargo_empleados
    WHERE 
        activo = 1 
        
		/*AND (
            (asigemp_fecha_limite IS NULL AND 
             DATE_TRUNC('month', asigemp_fecha_inicio) <= DATE_TRUNC('month', periodo::DATE))
            OR 
            (asigemp_fecha_limite IS NOT NULL AND 
             DATE_TRUNC('month', asigemp_fecha_inicio) <= DATE_TRUNC('month', periodo::DATE) AND 
             DATE_TRUNC('month', asigemp_fecha_limite) >= DATE_TRUNC('month', periodo::DATE))
        )*/
        AND DATE_TRUNC('month', periodo) BETWEEN DATE_TRUNC('month', fecha_inicio) 
        AND COALESCE(DATE_TRUNC('month', fecha_limite), DATE_TRUNC('month', periodo))
    GROUP BY 
        idempleado
)    
SELECT count(id) into totalEmpleados FROM asignacion_cargo_empleados INNER JOIN cte ON cte.idasignacion = asignacion_cargo_empleados.id WHERE activo = 1 ;
--edad afp
select edad into edadAfp from afp_edades where activo = 1;
--fecha corte edad
select fecha_limite into fechaCorteEdad from planilla_fechas where activo=1 and tipo='AFPS-EDAD' and id_mes= idMes;
-- total aporte solidario JSON
--salario minimo
select monto_bs into salarioMinimo from minimo_nacional_salarios where activo = 1 AND DATE_TRUNC('month', periodo) BETWEEN DATE_TRUNC('month', fecha_inicio) 
        AND COALESCE(DATE_TRUNC('month', fecha_limite), DATE_TRUNC('month', periodo));
-- reciva obligatorio
select totalganado into rcivaObligatorio from escala_rciva_salarios where activo = 1 order by id desc limit 1;
-- total salario mini rciva
select total_min_salario into totalSalMinRciva from configuracion_minimo_nacionales where activo= 1 and estado= 'AC' and tipo= 'RC-IVA';
-- fecha rciva anterior 
select fecha_limite into fechaRcivaAnt from planilla_fechas where id_mes = idMesAnt;
-- fecha rciva anctual 
select fecha_limite into fechaRcivaAct from planilla_fechas where id_mes = idMes;
-- ufv anterior
select valor into ufvAnt from ufvs where fecha = fechaRcivaAnt;
-- ufv actual
select valor into ufvAct from ufvs where fecha = fechaRcivaAct;
-- total salario min antiguedad
select total_min_salario into totalSalMinAnioServicio from configuracion_minimo_nacionales where activo= 1 and estado= 'AC' and tipo= 'ANTIGUEDAD';
--fecha corte antiguedad
select fecha_limite into fechaCorteAntiguedad from planilla_fechas where activo=1 and tipo='ANTIGUEDAD' and id_mes= idMes;

RETURN query select totalEmpleados,edadAfp ,fechaCorteEdad ,totalAporteSolidario ,salarioMinimo ,rcivaObligatorio ,totalSalMinRciva ,fechaRcivaAnt,fechaRcivaAct,
	ufvAnt ,ufvAct ,totalSalMinAnioServicio, periodoLiteral, fechaCorteAntiguedad;

end;

$BODY$;
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP FUNCTION fun_parametros_iniciales(date)');
  }
};