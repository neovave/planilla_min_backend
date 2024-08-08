'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ufv extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ufv.belongsTo(models.Mes,{as:'ufv_mes', foreignKey:'id_mes'});
    }
  }
  Ufv.init({
    fecha: DataTypes.DATE,
    valor: DataTypes.DECIMAL(10,5),
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ufv',
    tableName: 'ufvs',
  });
  return Ufv;
};