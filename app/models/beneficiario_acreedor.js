'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Beneficiario_acreedor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Beneficiario_acreedor.belongsTo(models.Asignacion_descuento,{as:'beneficiarioacreedor_asigdescuento',foreignKey:'id_asig_descuento'});
      Beneficiario_acreedor.belongsTo(models.Asignacion_subsidio,{as:'beneficiarioacreedor_asigsubsidio',foreignKey:'id_asig_subsidio'});
      //Beneficiario_acreedor.hasMany(models.Tipo_descuento_sancion,{as:'beneficiarioacreedor_tipodescuentosancion', foreignKey:'id_acreedor'});
    }
  }
  Beneficiario_acreedor.init({
    codigo: DataTypes.STRING(20),
    ci_ruc: DataTypes.STRING(20),
    detalle_ruc: DataTypes.STRING(100),
    tipo: DataTypes.STRING(30),
    descripcion: DataTypes.STRING(200),
    nro_cuenta: DataTypes.STRING(30),
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Beneficiario_acreedor',
    tableName: 'beneficiario_acreedores',
  });
  return Beneficiario_acreedor;
};