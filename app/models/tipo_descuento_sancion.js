'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tipo_descuento_sancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tipo_descuento_sancion.hasMany(models.Asignacion_descuento,{as:'tipodescuentosancion_asigdescuento', foreignKey:'id_tipo_descuento'});
      Tipo_descuento_sancion.hasMany(models.Asignacion_sancion,{as:'tipodescuentosancion_asigsancion', foreignKey:'id_tipo_sancion'});
      //Tipo_descuento_sancion.belongsTo(models.Beneficiario_acreedor,{as:'tipodescuentosancion_acreedor', foreignKey:'id_acreedor'});
    }
  }
  Tipo_descuento_sancion.init({
    codigo: DataTypes.INTEGER,
    nombre: DataTypes.STRING(120),
    nombre_abreviado: DataTypes.STRING(20),
    grupo: DataTypes.STRING(10),
    tipo: DataTypes.STRING(100),
    descripcion: DataTypes.STRING(200),
    unidad: DataTypes.STRING(3),
    con_beneficiario: DataTypes.BOOLEAN,
    servicio: DataTypes.STRING(20),
    grupo_suma: DataTypes.INTEGER,
    grupo_nombre: DataTypes.STRING(200),
    id_acreedor: DataTypes.INTEGER,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Tipo_descuento_sancion',
    tableName: 'tipo_descuento_sanciones',
  });
  return Tipo_descuento_sancion;
};