'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asignacion_sancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Asignacion_sancion.belongsTo(models.Tipo_descuento_sancion,{as:'asigancionsancion_tipodessan',foreignKey:'id_tipo_sancion'} );
      Asignacion_sancion.belongsTo(models.Empleado,{as:'asignaciondescuento_empleado',foreignKey:'id_empleado'});
    }
  }
  Asignacion_sancion.init({
    cod_empleado: DataTypes.STRING(15),
    monto: DataTypes.DECIMAL(8,2),
    unidad: DataTypes.STRING(2),
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    memo_nro: DataTypes.STRING(10),
    memo_detalle: DataTypes.STRING(200),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Asignacion_sancion',
    tableName: 'asignacion_sanciones',
  });
  return Asignacion_sancion;
};