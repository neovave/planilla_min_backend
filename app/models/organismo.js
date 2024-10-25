'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organismo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Organismo.hasMany(models.Reparticion,{as:'organismo_reparticion', foreignKey:'id_organismo'});
      //Organismo.hasMany(models.Destino,{as:'organismo_destino', foreignKey:'id_organismo'});
      Organismo.hasMany(models.Asignacion_cargo_empleado,{as:'organismo_asigcargoemp', foreignKey:'id_organismo'});
    }
  }
  Organismo.init({
    codigo: DataTypes.STRING(10),
    nombre: DataTypes.STRING(100),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Organismo',
    tableName: 'organismos',
  });
  return Organismo;
};