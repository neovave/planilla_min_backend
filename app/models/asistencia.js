'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asistencia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Asistencia.belongsTo(models.Mes,{as:'asistencia_mes', foreignKey:'id_mes'});
      Asistencia.belongsTo(models.Empleado,{as:'asistencia_empleado', foreignKey:'id_empleado'});
      Asistencia.belongsTo(models.Asignacion_cargo_empleado,{as:'asistencia_asignacioncargoemp', foreignKey:'id_asig_cargo'});
      Asistencia.belongsTo(models.Cargo,{as:'asistencia_cargo', foreignKey:'id_cargo'});
      
    }
  }
  Asistencia.init({
    dias_trabajados: DataTypes.INTEGER,
    dias_sancionados: DataTypes.INTEGER,
    cant_cargo: DataTypes.INTEGER,
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Asistencia',
    tableName: 'asistencias',
  });
  return Asistencia;
};