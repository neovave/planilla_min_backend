'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Configuracion_minimo_nacional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Configuracion_minimo_nacional.init({
    total_min_salario: DataTypes.INTEGER,
    descripcion: DataTypes.STRING(100),
    tipo: DataTypes.STRING(50),
    estado: DataTypes.STRING(2),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Configuracion_minimo_nacional',
    tableName: 'configuracion_minimo_nacionales',
  });
  return Configuracion_minimo_nacional;
};