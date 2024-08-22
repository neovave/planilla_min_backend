'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reparticion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reparticion.belongsTo(models.Organismo,{as:'reparticion_organismo', foreignKey:'id_organismo'});
      Reparticion.hasMany(models.Asignacion_cargo_empleado,{as:'reparticion_asigCarEmp', foreignKey:'id_reparticion'});
    }
  }
  Reparticion.init({
    codigo: DataTypes.STRING(10),
    nombre: DataTypes.STRING(100),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Reparticion',
    tableName: 'reparticiones',
  });
  return Reparticion;
};