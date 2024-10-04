'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seguro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seguro.hasMany(models.Seguro_empleado,{as:'seguro_seguroempleado', foreignKey:'id_seguro'});
      //Seguro.hasMany(models.Empleado,{as:'tipoplanilla_preventivo', foreignKey:'id_seguro'});
    }
  }
  Seguro.init({
    codigo: DataTypes.STRING(10),
    descripcion: DataTypes.STRING(200),
    abreviado: DataTypes.STRING(20),
    numero_patronal: DataTypes.STRING(20),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Seguro',
    tableName: 'seguros',
  });
  return Seguro;
};