'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rciva_descargo_salario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rciva_descargo_salario.belongsTo(models.Mes,{as:'rcivadescargosalario_mes', foreignKey:'id_mes'});
      Rciva_descargo_salario.belongsTo(models.Empleado,{as:'rcivadescargosalario_empleado', foreignKey:'id_empleado'});
      Rciva_descargo_salario.hasMany(models.Rciva_planilla,{as:'rcivadescargosalario_rcivaplanilla', foreignKey:'id_rciva_descargo'});
    }
  }
  Rciva_descargo_salario.init({
    nro_orden: DataTypes.STRING(20),
    total_facturas: DataTypes.DECIMAL(8,2),
    importe_cod26: DataTypes.DECIMAL(8,2),
    total_cod113: DataTypes.DECIMAL(8,2),
    importe_cod113: DataTypes.DECIMAL(8,2),
    importe_rciva: DataTypes.DECIMAL(8,2),
    importe_cod464: DataTypes.DECIMAL(8,2),
    importe_cod465: DataTypes.DECIMAL(8,2),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rciva_descargo_salario',
    tableName: 'rciva_descargo_salarios',
  });
  return Rciva_descargo_salario;
};