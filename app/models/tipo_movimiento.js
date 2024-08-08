'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tipo_movimiento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tipo_movimiento.hasMany(models.Asignacion_cargo_empleado,{as:'tipomov_asignacioncargoemp', foreignKey:'id_tipo_movimiento'});
    }
  }
  Tipo_movimiento.init({
    nombre: DataTypes.STRING(50),
    tipo: DataTypes.STRING(100),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tipo_movimiento',
    tableName: 'tipo_movimientos',
  });
  return Tipo_movimiento;
};