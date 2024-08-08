'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Escala_aporte_solidario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Escala_aporte_solidario.init({
    total_ganado: DataTypes.DECIMAL(8,2),
    porcentaje: DataTypes.DECIMAL(8,2),
    descripcion: DataTypes.STRING(200),
    estado: DataTypes.STRING(2),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Escala_aporte_solidario',
    tableName: 'escala_aporte_solidarios',
  });
  return Escala_aporte_solidario;
};