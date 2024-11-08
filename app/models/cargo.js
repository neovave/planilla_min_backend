'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cargo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cargo.belongsTo(models.Categoria_cargo,{as:'cargo_categoriacargo', foreignKey:'id_categoria'});
      Cargo.hasMany(models.Asignacion_cargo_empleado,{as:'cargo_asignacioncargoemp', foreignKey:'id_cargo'});
      Cargo.hasMany(models.Incremento,{as:'cargo_incremento', foreignKey:'id_cargo'});
      Cargo.hasMany(models.Asistencia,{as:'cargo_asistencia', foreignKey:'id_cargo'});
    }
  }
  Cargo.init({
    codigo: DataTypes.STRING(10),
    descripcion: DataTypes.STRING(200),
    monto: DataTypes.DECIMAL(8,2),
    nivel: DataTypes.INTEGER,
    cantidad_item: DataTypes.INTEGER,
    tipo: DataTypes.STRING(20),
    monto_mensual: DataTypes.DECIMAL(8,2),
    estado: DataTypes.STRING(2),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cargo',
    tableName: 'cargos',
  });
  return Cargo;
};