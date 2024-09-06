'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empleado_no_aportante extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Empleado_no_aportante.belongsTo(models.Empleado,{as:'empnoaportante_empleado', foreignKey:'id_empleado'});
    }
  }
  Empleado_no_aportante.init({
    
    descripcion: DataTypes.STRING(300),
    fecha_inicio: DataTypes.DATE,
    tipo: DataTypes.STRING(30),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Empleado_no_aportante',
    tableName: 'empleado_no_aportantes',
  });
  return Empleado_no_aportante;
};