'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grado_academico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Grado_academico.hasMany(models.Empleado,{as:'gradoacademico_empleado' ,foreignKey: 'id_grado_academico' });
    }
  }
  Grado_academico.init({
    codigo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Grado_academico',
    tableName: 'grado_academicos',
  });
  return Grado_academico;
};