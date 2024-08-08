'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unidad_ejecutora extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Unidad_ejecutora.init({
    codigo: DataTypes.STRING(10),
    descripcion: DataTypes.STRING(50),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Unidad_ejecutora',
    tableName: 'unidad_ejecutoras',
  });
  return Unidad_ejecutora;
};