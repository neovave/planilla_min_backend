'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seguro_empleado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seguro_empleado.belongsTo(models.Empleado,{as:'seguroempleado_empleado', foreignKey:'id_empleado'});
      Seguro_empleado.belongsTo(models.Seguro,{as:'seguroempleado_seguro', foreignKey:'id_seguro'});
    }
  }
  Seguro_empleado.init({
    motivo: DataTypes.STRING(200),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Seguro_empleado',
    tableName: 'seguro_empleados',
  });
  return Seguro_empleado;
};