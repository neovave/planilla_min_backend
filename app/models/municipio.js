'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Municipio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Municipio.hasMany(models.Reparticion ,{as:'municipio_reparticion', foreignKey:'id_municipio'});
      Municipio.hasMany(models.Asignacion_descuento ,{as:'municipio_asigdescuento', foreignKey:'id_municipio'});
      Municipio.hasMany(models.Asignacion_subsidio ,{as:'municipio_asigsubsidio', foreignKey:'id_municipio'});
    }
  }
  Municipio.init({
    codigo: DataTypes.STRING(10),
    nombre: DataTypes.STRING(100),
    nombre_abreviado: DataTypes.STRING(10),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Municipio',
    tableName: 'municipios',
  });
  return Municipio;
};