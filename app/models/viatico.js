'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Viatico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Viatico.belongsTo(models.Empleado,{as:'viatico_emplado' ,foreignKey: 'id_empleado' });
      Viatico.belongsTo(models.Mes,{as:'viatico_mes' ,foreignKey: 'id_mes' });
    }
  }
  Viatico.init({
    numero: DataTypes.STRING(10),
    memo: DataTypes.STRING(20),
    detalle: DataTypes.STRING(300),
    importe: DataTypes.DECIMAL(8,2),
    activo: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Viatico',
    tableName: 'viaticos',
  });
  return Viatico;
};