'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grupo_descuento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Grupo_descuento.hasMany(models.Tipo_descuento_sancion,{as:'grupodescuento_tipodescuentosancion', foreignKey:'id_grupodescuento'});
    }
  }
  Grupo_descuento.init({
    codigo: DataTypes.STRING(10),
    nombre: DataTypes.STRING(100),
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Grupo_descuento',
    tableName: 'grupo_descuentos',
  });
  return Grupo_descuento;
};