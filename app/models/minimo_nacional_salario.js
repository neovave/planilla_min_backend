'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Minimo_nacional_salario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Minimo_nacional_salario.hasMany(models.Rciva_planilla,{as:'minimonacsal_rcivaplanilla', foreignKey:'id_minimo_nacional'});
    }
  }
  Minimo_nacional_salario.init({
    monto_bs: DataTypes.DECIMAL(8,2),
    descripcion: DataTypes.STRING(200),
    fecha_inicio: DataTypes.DATE,
    fecha_limite: DataTypes.DATE,
    estado: DataTypes.STRING,
    id_user_create: DataTypes.INTEGER,
    id_user_mod: DataTypes.INTEGER,
    id_user_delete: DataTypes.INTEGER,
    activo: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Minimo_nacional_salario',
    tableName: 'minimo_nacional_salarios',
  });
  return Minimo_nacional_salario;
};