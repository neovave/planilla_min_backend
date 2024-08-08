'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Direccion_administrativa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Direccion_administrativa.init({
    codigo: DataTypes.STRING(10),
    descripcion: DataTypes.STRING(50),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Direccion_administrativa',
    tableName: 'direccion_administrativas',
  });
  return Direccion_administrativa;
};