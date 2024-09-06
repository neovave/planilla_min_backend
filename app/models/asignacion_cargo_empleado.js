'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asignacion_cargo_empleado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Asignacion_cargo_empleado.belongsTo(models.Gestion,{as:'asignacioncargoemp_gestion', foreignKey:'id_gestion'});
      Asignacion_cargo_empleado.belongsTo(models.Empleado,{as:'asignacioncargoemp_empleado', foreignKey:'id_empleado'});
      Asignacion_cargo_empleado.belongsTo(models.Cargo,{as:'asignacioncargoemp_cargo', foreignKey:'id_cargo'});
      Asignacion_cargo_empleado.belongsTo(models.Tipo_movimiento,{as:'asignacioncargoemp_tipomovimiento', foreignKey:'id_tipo_movimiento'});
      Asignacion_cargo_empleado.hasMany(models.Asistencia,{as:'asignacioncargoemp_asistencia', foreignKey:'id_asig_cargo'});
      Asignacion_cargo_empleado.belongsTo(models.Reparticion,{as:'asignacioncargoemp_reparticion', foreignKey:'id_reparticion'});
      Asignacion_cargo_empleado.belongsTo(models.Destino,{as:'asignacioncargoemp_destino', foreignKey:'id_destino'});
      Asignacion_cargo_empleado.hasMany(models.Salario_planilla,{as:'asignacioncargoemp_salarioplanilla', foreignKey:'id_asig_cargo'});
    }
  }
  Asignacion_cargo_empleado.init({
    ci_empleado: DataTypes.STRING(15),
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    motivo: DataTypes.STRING(300),
    nro_item: DataTypes.INTEGER,
    ingreso: DataTypes.BOOLEAN,
    retiro: DataTypes.BOOLEAN,
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    estado: DataTypes.STRING(2)
  }, {
    sequelize,
    modelName: 'Asignacion_cargo_empleado',
    tableName: 'asignacion_cargo_empleados',
  });
  return Asignacion_cargo_empleado;
};