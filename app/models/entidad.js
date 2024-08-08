'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Entidad.init({
    codigo: DataTypes.STRING(10),
    descripcion: DataTypes.STRING(50),
    distrito_cobranza: DataTypes.STRING(10),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Entidad',
    tableName: 'entidades',
  });
  return Entidad;
};