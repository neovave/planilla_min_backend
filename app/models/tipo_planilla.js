'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tipo_planilla extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tipo_planilla.hasMany(models.Preventivo,{as:'tipoplanilla_preventivo', foreignKey:'id_tipo_planilla'});
    }
  }
  Tipo_planilla.init({
    codigo: DataTypes.STRING(2),
    nombre: DataTypes.STRING(15),
    id_user_create: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Tipo_planilla',
    tableName: 'tipo_planillas',
  });
  return Tipo_planilla;
};