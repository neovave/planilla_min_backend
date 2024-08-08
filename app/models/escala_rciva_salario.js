'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Escala_rciva_salario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Escala_rciva_salario.init({
    totalganado: DataTypes.DECIMAL(8,2),
    descripcion: DataTypes.STRING(300),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Escala_rciva_salario',
    tableName: 'escala_rciva_salarios',
  });
  return Escala_rciva_salario;
};