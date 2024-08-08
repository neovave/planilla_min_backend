'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Escala_afp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Escala_afp.hasMany(models.Configuracion_afp,{as:'escalaafp_configuracionafp',foreignKey:'id_escala_afp'} );
    }
  }
  Escala_afp.init({
    nombre: DataTypes.STRING(60),
    porcentaje: DataTypes.DECIMAL(8,2),
    descripcion: DataTypes.STRING(20),
    afp_codigo: DataTypes.JSONB,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Escala_afp',
    tableName: 'escala_afps',
  });
  return Escala_afp;
};