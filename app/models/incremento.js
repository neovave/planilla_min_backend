'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Incremento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Incremento.belongsTo(models.Gestion,{as:'incremento_gestion', foreignKey:'id_gestion'});
      Incremento.belongsTo(models.Cargo,{as:'incremento_cargo', foreignKey:'id_cargo'});
    }
  }
  Incremento.init({
    monto: DataTypes.DECIMAL(8,2),
    unidad: DataTypes.STRING(2),
    porcentaje: DataTypes.DECIMAL(8,2),
    descripcion: DataTypes.STRING(200),
    fecha_habilitacion: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    activo: DataTypes.BIGINT,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Incremento',
    tablelName: 'incrementos',
  });
  return Incremento;
};