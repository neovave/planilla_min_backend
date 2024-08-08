'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Aporte extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Aporte.hasMany(models.Aporte_empleado,{as:'aporte_aporteempleado', foreignKey:'id_aporte'});
    }
  }
  Aporte.init({
    codigo: DataTypes.STRING(10),
    descripcion: DataTypes.STRING(100),
    abreviado: DataTypes.STRING(10),
    numero_patronal: DataTypes.STRING(20),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Aporte',
    tableName: 'aportes',
  });
  return Aporte;
};