'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rciva_certificacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rciva_certificacion.belongsTo(models.Mes,{as:'rcivacertificacion_mes', foreignKey:'id_mes'});
      Rciva_certificacion.belongsTo(models.Empleado,{as:'rcivacertificacion_empleado', foreignKey:'id_empleado'});
      Rciva_certificacion.hasMany(models.Rciva_planilla,{as:'rcivacertificacion_rcivaplanilla', foreignKey:'id_rciva_certificado'});
    }
  }
  Rciva_certificacion.init({
    impuesto_saldo: DataTypes.DECIMAL(8,2),
    impuesto_fecha_saldo: DataTypes.DATE,
    impuesto_numero: DataTypes.STRING(10),
    impuesto_descripcion: DataTypes.STRING(200),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rciva_certificacion',
    tableName: 'rciva_certificaciones',
  });
  return Rciva_certificacion;
};