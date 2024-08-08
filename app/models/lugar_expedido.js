'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lugar_expedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lugar_expedido.hasMany(models.Empleado,{as:'expedido_empleado' ,foreignKey: 'id_expedido' });
    }
  }
  Lugar_expedido.init({
    codigo: DataTypes.STRING(10),
    descripcion: DataTypes.STRING(50),
    activo: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Lugar_expedido',
    tableName: 'lugar_expedidos',
  });
  return Lugar_expedido;
};