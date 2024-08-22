'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Destino extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Destino.belongsTo(models.Organismo,{as:'destino_organismo', foreignKey:'id_organismo'});
      Destino.hasMany(models.Asignacion_cargo_empleado,{as:'destino_asigCarEmp', foreignKey:'id_destino'});
    }
  }
  Destino.init({
    codigo: DataTypes.STRING(10),
    nombre: DataTypes.STRING(100),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Destino',
    tableName: 'destinos',
  });
  return Destino;
};