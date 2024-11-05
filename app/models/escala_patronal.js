'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Escala_patronal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Escala_patronal.init({
    nombre: DataTypes.STRING(60),
    porcentaje: DataTypes.DECIMAL(8,2),
    descripcion: DataTypes.STRING(20),
    apat_codigo: DataTypes.JSONB,
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    aplica_certificacion_afp: DataTypes.BOOLEAN,
    aplica_edad_limite: DataTypes.BOOLEAN,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Escala_patronal',
    tableName: 'escala_patronales',
  });
  return Escala_patronal;
};