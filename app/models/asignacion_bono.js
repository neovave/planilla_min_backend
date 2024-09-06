'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asignacion_bono extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Asignacion_bono.belongsTo(models.Bono,{as:'asignacionbono_bono',foreignKey:'id_bono'});
      Asignacion_bono.belongsTo(models.Empleado,{as:'asignacionbono_empleado',foreignKey:'id_empleado'});
    }
  }
  Asignacion_bono.init({
    
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    estado: DataTypes.STRING(2),

    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Asignacion_bono',
    tableName: 'asignacion_bonos',
  });
  return Asignacion_bono;
};