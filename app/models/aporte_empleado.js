'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Aporte_empleado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Aporte_empleado.belongsTo(models.Empleado,{as:'aporteempleado_empleado', foreignKey:'id_empleado'});
      Aporte_empleado.belongsTo(models.Aporte,{as:'aporteempleado_aporte', foreignKey:'id_aporte'});
    }
  }
  Aporte_empleado.init({
    motivo: DataTypes.STRING(100),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Aporte_empleado',
    tableName: 'aporte_empleados',
  });
  return Aporte_empleado;
};