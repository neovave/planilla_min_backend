'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asignacion_subsidio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Asignacion_subsidio.belongsTo(models.Tipo_descuento_sancion,{as:'asigancionsubsidio_tipodes',foreignKey:'id_tipo_descuento'} );
      Asignacion_subsidio.belongsTo(models.Empleado,{as:'asignacionsubsidio_empleado',foreignKey:'id_empleado'});
      Asignacion_subsidio.hasMany(models.Beneficiario_acreedor,{as:'asignacionsubsidio_beneficiario', foreignKey:'id_asig_subsidio'});
    }
  }
  Asignacion_subsidio.init({
    monto:  DataTypes.DECIMAL(8,2),
    unidad: DataTypes.STRING(2),
    tipo_pago: DataTypes.STRING(20),
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    memo_nro: DataTypes.STRING(10),
    memo_detalle: DataTypes.STRING(300),
    estado: DataTypes.STRING(2),
    activo: DataTypes.BIGINT,
  },{
    sequelize,
    modelName: 'Asignacion_subsidio',
    tableName: 'asignacion_subsidios',
  });
  return Asignacion_subsidio;
};