'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rciva_planilla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rciva_planilla.belongsTo(models.Mes,{as:'rcivaplanilla_mes', foreignKey:'id_mes'});
      Rciva_planilla.belongsTo(models.Minimo_nacional_salario,{as:'rcivaplanilla_minimonacsal', foreignKey:'id_minimo_nacional'});
      Rciva_planilla.belongsTo(models.Escala_rciva_salario,{as:'rcivaplanilla_escalarciva', foreignKey:'id_escala_rciva'});
      Rciva_planilla.belongsTo(models.Empleado,{as:'rcivaplanilla_empleado', foreignKey:'id_empleado'});
      Rciva_planilla.belongsTo(models.Rciva_certificacion,{as:'rcivaplanilla_rcivacetificacion', foreignKey:'id_rciva_certificado'});
      Rciva_planilla.belongsTo(models.Rciva_descargo_salario,{as:'rcivaplanilla_rcivadescargosal', foreignKey:'id_rciva_descargo'});
      Rciva_planilla.belongsTo(models.Planilla_fecha,{as:'rcivaplanilla_planillafecha', foreignKey:'id_rciva_planilla_fecha'});      
    }
  }
  Rciva_planilla.init({
    novedad: DataTypes.STRING(2),
    ingreso_neto_bs: DataTypes.DECIMAL(8,2),
    minimo_imponible: DataTypes.DECIMAL(8,2),
    importe_sujeto_impuesto: DataTypes.DECIMAL(8,2),
    impuesto_rciva: DataTypes.DECIMAL(8,2),
    monto_porcentaje_smn: DataTypes.DECIMAL(8,2),
    impuesto_neto: DataTypes.DECIMAL(8,2),
    saldo_favor_fisco: DataTypes.DECIMAL(8,2),
    saldo_favor_dependiente: DataTypes.DECIMAL(8,2),
    total_salado_mes_anterior: DataTypes.DECIMAL(8,2),
    monto_saldo_actualizacion: DataTypes.DECIMAL(8,2),
    total_actualizacion: DataTypes.DECIMAL(8,2),
    saldo_utilizado: DataTypes.DECIMAL(8,2),
    rciva_retenido: DataTypes.DECIMAL(8,2),
    saldo_rciva_dependiente: DataTypes.DECIMAL(8,2),
    saldo_rciva_dependiente2: DataTypes.DECIMAL(8,2),
    total_viaticos: DataTypes.DECIMAL(8,2),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rciva_planilla',
    tableName: 'rciva_planillas',
  });
  return Rciva_planilla;
};