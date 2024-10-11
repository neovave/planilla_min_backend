'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Asignacion_descuento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Asignacion_descuento.belongsTo(models.Tipo_descuento_sancion,{as:'asiganciondescuento_tipodes',foreignKey:'id_tipo_descuento'} );
      Asignacion_descuento.belongsTo(models.Empleado,{as:'asignaciondescuento_empleado',foreignKey:'id_empleado'});
      Asignacion_descuento.belongsTo(models.Municipio,{as:'asignaciondescuento_municipio',foreignKey:'id_municipio'});
      Asignacion_descuento.hasMany(models.Beneficiario_acreedor,{as:'asignaciondescuento_beneficiario', foreignKey:'id_asig_descuento'});
    }
  }
  Asignacion_descuento.init({
    cod_empleado: DataTypes.STRING(15),
    monto: DataTypes.DECIMAL(8,2),
    unidad: DataTypes.STRING(2),
    institucion: DataTypes.STRING(8),
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    memo_nro: DataTypes.STRING(10),
    memo_detalle: DataTypes.STRING(200),
    referencia: DataTypes.STRING(200),
    estado: DataTypes.STRING(2),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Asignacion_descuento',
    tableName: 'asignacion_descuentos',
  });
  return Asignacion_descuento;
};