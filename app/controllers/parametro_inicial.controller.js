
const { response, request } = require('express');
const { Op, QueryTypes  } = require("sequelize");
const { sequelize} = require('../database/config');

const getParametroInicialPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, id} = req.query;
        
        const parametros = await sequelize.query(`
            SELECT * from fun_parametros_iniciales(`+id+`);
          `,{
            type: QueryTypes.SELECT  // Esto especifica que esperas un resultado tipo SELECT
          });

        //let aportes = await paginate(Aporte, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            parametros
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const getAsignacionActivo = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, periodo} = req.query;
        
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

        //let aportes = await paginate(Aporte, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            asignacion
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
    getParametroInicialPaginate,
    getAsignacionActivo
};