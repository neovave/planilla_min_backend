'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION public.aporte_afps_vigentes(
      OUT cod_config_afp integer,
      OUT nombre_afp character varying,
      OUT abreviatura_afp character varying,
      OUT porcentaje numeric,
      OUT aplica_certificacion boolean,
      OUT aplica_edad_limite boolean,
      OUT codigo_afp jsonb )
        RETURNS SETOF record 
        LANGUAGE 'plpgsql'
        COST 100
        VOLATILE PARALLEL UNSAFE
        ROWS 1000

    AS $BODY$
    begin
      return query 
        SELECT
          configuracion_afps.id,			
          escala_afps.nombre,
          escala_afps.descripcion,
          escala_afps.porcentaje,
          configuracion_afps.aplica_certificado,
          configuracion_afps.aplica_edad_limite, 
          escala_afps.afp_codigo
        FROM configuracion_afps
        INNER JOIN escala_afps ON configuracion_afps.id_escala_afp = escala_afps.id
        WHERE configuracion_afps.activo = 1 ;	
    end;
    $BODY$;
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP FUNCTION aporte_afps_vigentes()');
  }
};