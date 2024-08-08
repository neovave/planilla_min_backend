'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria_cargo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Categoria_cargo.hasMany(models.Cargo,{as:'categoriacargo_cargo', foreignKey:'id_categoria'});
    }
  }
  Categoria_cargo.init({
    nombre: DataTypes.STRING(50),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Categoria_cargo',
    tableName: 'categoria_cargos',
  });
  return Categoria_cargo;
};