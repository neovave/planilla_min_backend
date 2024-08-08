'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Configuracion_afp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Configuracion_afp.belongsTo(models.Escala_afp,{as:'configuracionafp_escalaafp',foreignKey:'id_escala_afp'});       
    }
  }
  Configuracion_afp.init({
    aplica_certificado: DataTypes.BOOLEAN,
    aplica_edad_limite: DataTypes.BOOLEAN,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Configuracion_afp',
    tableName: 'configuracion_afps',
  });
  return Configuracion_afp;
};